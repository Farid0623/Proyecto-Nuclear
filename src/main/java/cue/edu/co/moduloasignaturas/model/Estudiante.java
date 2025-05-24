package cue.edu.co.moduloasignaturas.model;

import cue.edu.co.moduloasignaturas.observer.Observer;
import cue.edu.co.moduloasignaturas.observer.TipoCambio;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.index.Indexed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

/**
 * Entidad Estudiante que implementa las reglas OCL y el patrón Observer:
 * - cumplePrerequisitos: Valida que el estudiante haya aprobado prerrequisitos
 * - noConflictoHorario: Valida que no haya conflictos de horario entre asignaturas
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "estudiantes")
public class Estudiante implements Observer {

    private static final Logger log = LoggerFactory.getLogger(Estudiante.class);

    @Id
    private String id;

    @NotBlank(message = "El código del estudiante es obligatorio")
    @Pattern(regexp = "^[0-9]{8,12}$", message = "El código debe tener entre 8 y 12 dígitos")
    @Indexed(unique = true)
    private String codigo;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombres;

    @NotBlank(message = "Los apellidos son obligatorios")
    private String apellidos;

    @Email(message = "El email debe ser válido")
    @NotBlank(message = "El email es obligatorio")
    @Indexed(unique = true)
    private String email;

    private String telefono;

    // Plan de estudios al que pertenece
    @DBRef
    private PlanEstudios planEstudios;

    // Asignaturas que ha matriculado (historial académico)
    @Builder.Default
    private List<AsignaturaMatriculada> asignaturasMatriculadas = new ArrayList<>();

    // Asignaturas actualmente matriculadas
    @Builder.Default
    private List<AsignaturaMatriculada> matriculaActual = new ArrayList<>();

    // Notificaciones recibidas (patrón Observer)
    @Builder.Default
    private List<String> notificacionesRecibidas = new ArrayList<>();

    @CreatedDate
    private LocalDateTime fechaCreacion;

    @LastModifiedDate
    private LocalDateTime fechaModificacion;

    // Implementación del patrón Observer
    @Override
    public void actualizar(String mensaje, TipoCambio tipo, Object datos) {
        String notificacionCompleta = String.format("[%s] %s: %s",
                LocalDateTime.now(), tipo.getDescripcion(), mensaje);

        notificacionesRecibidas.add(notificacionCompleta);

        // Procesamiento específico según el tipo de cambio
        switch (tipo) {
            case ASIGNATURA_AGREGADA:
                procesarAsignaturaAgregada(mensaje, datos);
                break;
            case ASIGNATURA_ELIMINADA:
                procesarAsignaturaEliminada(mensaje, datos);
                break;
            case ASIGNATURA_MODIFICADA:
                procesarAsignaturaModificada(mensaje, datos);
                break;
            case PRERREQUISITO_AGREGADO:
            case PRERREQUISITO_ELIMINADO:
                procesarCambioPrerrequisitos(mensaje, datos);
                break;
            default:
                procesarOtroCambio(mensaje, tipo, datos);
        }

        log.info("Estudiante {} notificado: {}", codigo, mensaje);
    }

    /**
     * Procesa cuando se agrega una nueva asignatura
     */
    private void procesarAsignaturaAgregada(String mensaje, Object datos) {
        if (datos instanceof Asignatura) {
            Asignatura nuevaAsignatura = (Asignatura) datos;
            log.info("Estudiante {} informado sobre nueva asignatura disponible: {}",
                    codigo, nuevaAsignatura.getCodigo());

            // Verificar si puede matricular la nueva asignatura
            if (cumplePrerequisitos(nuevaAsignatura)) {
                log.info("Estudiante {} puede matricular la nueva asignatura {}",
                        codigo, nuevaAsignatura.getCodigo());
            }
        }
    }

    /**
     * Procesa cuando se elimina una asignatura
     */
    private void procesarAsignaturaEliminada(String mensaje, Object datos) {
        if (datos instanceof Asignatura) {
            Asignatura asignaturaEliminada = (Asignatura) datos;

            // Verificar si el estudiante tenía matriculada esta asignatura
            boolean teniMatriculada = matriculaActual.stream()
                    .anyMatch(am -> am.getAsignatura().equals(asignaturaEliminada));

            if (teniMatriculada) {
                log.warn("Estudiante {} debe revisar su matrícula: asignatura {} eliminada",
                        codigo, asignaturaEliminada.getCodigo());

                // Cancelar matrícula automáticamente
                cancelarMatricula(asignaturaEliminada.getCodigo());
            }
        }
    }

    /**
     * Procesa modificaciones en asignaturas
     */
    private void procesarAsignaturaModificada(String mensaje, Object datos) {
        if (datos instanceof Asignatura) {
            Asignatura asignaturaModificada = (Asignatura) datos;

            // Verificar si el estudiante tiene matriculada esta asignatura
            boolean tieneMatriculada = matriculaActual.stream()
                    .anyMatch(am -> am.getAsignatura().equals(asignaturaModificada));

            if (tieneMatriculada) {
                log.info("Estudiante {} informado sobre cambios en su asignatura matriculada: {}",
                        codigo, asignaturaModificada.getCodigo());
            }
        }
    }

    /**
     * Procesa cambios en prerrequisitos
     */
    private void procesarCambioPrerrequisitos(String mensaje, Object datos) {
        log.info("Estudiante {} informado sobre cambio en prerrequisitos: {}", codigo, mensaje);

        // Re-evaluar elegibilidad para asignaturas
        reevaluarElegibilidadAsignaturas();
    }

    /**
     * Procesa otros tipos de cambios
     */
    private void procesarOtroCambio(String mensaje, TipoCambio tipo, Object datos) {
        log.info("Estudiante {} informado sobre {}: {}", codigo, tipo.getDescripcion(), mensaje);
    }

    /**
     * Re-evalúa qué asignaturas puede matricular el estudiante
     */
    private void reevaluarElegibilidadAsignaturas() {
        if (planEstudios != null) {
            List<Asignatura> asignaturasDisponibles = planEstudios.obtenerTodasLasAsignaturas();

            List<Asignatura> nuevasOpciones = asignaturasDisponibles.stream()
                    .filter(this::cumplePrerequisitos)
                    .filter(a -> !yaEstaMatriculadaOAprobada(a))
                    .toList();

            if (!nuevasOpciones.isEmpty()) {
                log.info("Estudiante {} tiene {} nuevas asignaturas disponibles para matricular",
                        codigo, nuevasOpciones.size());
            }
        }
    }

    /**
     * Verifica si una asignatura ya está matriculada o aprobada
     */
    private boolean yaEstaMatriculadaOAprobada(Asignatura asignatura) {
        return matriculaActual.stream().anyMatch(am -> am.getAsignatura().equals(asignatura)) ||
                asignaturasMatriculadas.stream().anyMatch(am ->
                        am.getAsignatura().equals(asignatura) && am.verificarAprobacion());
    }

    /**
     * Obtiene notificaciones recientes
     */
    public List<String> obtenerNotificacionesRecientes(int limite) {
        int inicio = Math.max(0, notificacionesRecibidas.size() - limite);
        return notificacionesRecibidas.subList(inicio, notificacionesRecibidas.size());
    }

    // Métodos de validación OCL

    /**
     * Valida que el estudiante cumpla con los prerrequisitos
     * OCL: inv cumplePrerequisitos:
     *      self.asignaturaMatriculada->forAll(am |
     *          am.asignatura.prerrequisito->forAll(prereq |
     *              self.asignaturaMatriculada->exists(amPrereq |
     *                  amPrereq.asignatura = prereq and amPrereq.verificarAprobacion())))
     */
    public boolean validarCumplePrerequisitos() {
        if (matriculaActual == null || matriculaActual.isEmpty()) {
            return true;
        }

        return matriculaActual.stream().allMatch(am -> {
            List<Asignatura> prerrequisitos = am.getAsignatura().obtenerPrerrequisitos();
            return prerrequisitos.stream().allMatch(prereq ->
                    asignaturasMatriculadas.stream().anyMatch(amPrereq ->
                            amPrereq.getAsignatura().equals(prereq) && amPrereq.verificarAprobacion()
                    )
            );
        });
    }

    /**
     * Valida que no haya conflictos de horario
     * OCL: inv noConflictoHorario: Validación compleja de solapamiento de horarios
     */
    public boolean validarNoConflictoHorario() {
        if (matriculaActual == null || matriculaActual.size() <= 1) {
            return true;
        }

        for (int i = 0; i < matriculaActual.size(); i++) {
            for (int j = i + 1; j < matriculaActual.size(); j++) {
                AsignaturaMatriculada am1 = matriculaActual.get(i);
                AsignaturaMatriculada am2 = matriculaActual.get(j);

                if (tieneConflictoHorario(am1, am2)) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Verifica si dos asignaturas matriculadas tienen conflicto de horario
     */
    private boolean tieneConflictoHorario(AsignaturaMatriculada am1, AsignaturaMatriculada am2) {
        List<Horario> horarios1 = am1.getAsignatura().getHorarios();
        List<Horario> horarios2 = am2.getAsignatura().getHorarios();

        if (horarios1 == null || horarios2 == null) {
            return false;
        }

        return horarios1.stream().anyMatch(h1 ->
                horarios2.stream().anyMatch(h2 -> h1.tieneConflictoCon(h2))
        );
    }

    /**
     * Valida todas las reglas OCL del estudiante
     */
    public boolean validarTodasLasReglas() {
        return validarCumplePrerequisitos() && validarNoConflictoHorario();
    }

    // Métodos de gestión académica

    /**
     * Matricula una asignatura si cumple prerrequisitos y no hay conflictos
     */
    public boolean matricularAsignatura(Asignatura asignatura) {
        if (asignatura == null || !asignatura.getActiva()) {
            return false;
        }

        // Verificar prerrequisitos
        if (!cumplePrerequisitos(asignatura)) {
            return false;
        }

        // Crear matrícula temporal para verificar conflictos
        AsignaturaMatriculada nuevaMatricula = AsignaturaMatriculada.builder()
                .asignatura(asignatura)
                .fechaMatricula(LocalDateTime.now())
                .estado(EstadoMatricula.MATRICULADA)
                .build();

        // Verificar conflictos de horario
        List<AsignaturaMatriculada> matriculaTemp = new ArrayList<>(matriculaActual);
        matriculaTemp.add(nuevaMatricula);

        List<AsignaturaMatriculada> matriculaOriginal = this.matriculaActual;
        this.matriculaActual = matriculaTemp;

        boolean sinConflictos = validarNoConflictoHorario();
        this.matriculaActual = matriculaOriginal;

        if (sinConflictos) {
            matriculaActual.add(nuevaMatricula);
            return true;
        }

        return false;
    }

    /**
     * Verifica si el estudiante cumple prerrequisitos para una asignatura
     */
    public boolean cumplePrerequisitos(Asignatura asignatura) {
        List<Asignatura> prerrequisitos = asignatura.obtenerPrerrequisitos();
        if (prerrequisitos.isEmpty()) {
            return true;
        }

        return prerrequisitos.stream().allMatch(prereq ->
                asignaturasMatriculadas.stream().anyMatch(am ->
                        am.getAsignatura().equals(prereq) && am.verificarAprobacion()
                )
        );
    }

    /**
     * Cancela la matrícula de una asignatura
     */
    public boolean cancelarMatricula(String codigoAsignatura) {
        return matriculaActual.removeIf(am ->
                am.getAsignatura().getCodigo().equals(codigoAsignatura)
        );
    }

    /**
     * Obtiene las asignaturas actualmente matriculadas
     */
    public List<Asignatura> obtenerAsignaturasActuales() {
        return matriculaActual.stream()
                .map(AsignaturaMatriculada::getAsignatura)
                .toList();
    }

    /**
     * Obtiene el historial académico (asignaturas aprobadas)
     */
    public List<Asignatura> obtenerAsignaturasAprobadas() {
        return asignaturasMatriculadas.stream()
                .filter(AsignaturaMatriculada::verificarAprobacion)
                .map(AsignaturaMatriculada::getAsignatura)
                .toList();
    }

    /**
     * Calcula los créditos aprobados
     */
    public int calcularCreditosAprobados() {
        return obtenerAsignaturasAprobadas().stream()
                .mapToInt(Asignatura::calcularCreditos)
                .sum();
    }

    /**
     * Calcula los créditos actualmente matriculados
     */
    public int calcularCreditosMatriculados() {
        return obtenerAsignaturasActuales().stream()
                .mapToInt(Asignatura::calcularCreditos)
                .sum();
    }

    public String getNombreCompleto() {
        return nombres + " " + apellidos;
    }

    @Override
    public String toString() {
        return "Estudiante{" +
                "codigo='" + codigo + '\'' +
                ", nombres='" + nombres + '\'' +
                ", apellidos='" + apellidos + '\'' +
                ", creditosAprobados=" + calcularCreditosAprobados() +
                ", creditosMatriculados=" + calcularCreditosMatriculados() +
                ", notificaciones=" + notificacionesRecibidas.size() +
                '}';
    }
}