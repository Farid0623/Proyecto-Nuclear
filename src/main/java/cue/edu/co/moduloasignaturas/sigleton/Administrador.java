package cue.edu.co.moduloasignaturas.singleton;

import cue.edu.co.moduloasignaturas.model.PlanEstudios;
import cue.edu.co.moduloasignaturas.model.Asignatura;
import cue.edu.co.moduloasignaturas.factory.AsignaturaFactory;
import cue.edu.co.moduloasignaturas.builder.PlanEstudiosBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

/**
 * Clase Singleton para el Administrador del sistema
 * Garantiza que solo exista una instancia del administrador
 */
@Component
public class Administrador {

    private static final Logger log = LoggerFactory.getLogger(Administrador.class);

    // Instancia única (Singleton)
    private static Administrador instancia;

    // Información del administrador
    private String id;
    private String nombre;
    private String email;
    private LocalDateTime fechaInicioSesion;
    private List<String> operacionesRealizadas;

    // Dependencias inyectadas por Spring
    @Autowired
    private AsignaturaFactory asignaturaFactory;

    @Autowired
    private PlanEstudiosBuilder planEstudiosBuilder;

    // Constructor privado para Singleton
    private Administrador() {
        this.operacionesRealizadas = new ArrayList<>();
        log.info("Administrador creado");
    }

    /**
     * Obtiene la instancia única del Administrador (patrón Singleton)
     */
    public static synchronized Administrador obtenerInstancia() {
        if (instancia == null) {
            instancia = new Administrador();
        }
        return instancia;
    }

    /**
     * Inicialización post-construcción para Spring
     */
    @PostConstruct
    private void inicializar() {
        instancia = this;
        this.id = "ADMIN001";
        this.nombre = "Administrador del Sistema";
        this.email = "admin@cue.edu.co";
        this.fechaInicioSesion = LocalDateTime.now();
        log.info("Administrador inicializado: {}", nombre);
    }

    /**
     * Crea una nueva asignatura usando el Factory
     */
    public Asignatura crearAsignatura(String codigo, String nombre, Integer creditos,
                                      Integer horasTeoricas, Integer horasPracticas) {
        log.info("Administrador creando asignatura: {}", codigo);

        Asignatura asignatura = asignaturaFactory.crearAsignatura(
                codigo, nombre, creditos, horasTeoricas, horasPracticas);

        registrarOperacion("Creada asignatura: " + codigo);
        return asignatura;
    }

    /**
     * Modifica una asignatura existente
     */
    public Asignatura modificarAsignatura(Asignatura asignatura, String nuevoNombre,
                                          String nuevaDescripcion) {
        log.info("Administrador modificando asignatura: {}", asignatura.getCodigo());

        if (nuevoNombre != null && !nuevoNombre.trim().isEmpty()) {
            asignatura.setNombre(nuevoNombre);
        }

        if (nuevaDescripcion != null) {
            asignatura.setDescripcion(nuevaDescripcion);
        }

        // Validar que sigue cumpliendo las reglas OCL
        if (!asignatura.validarTodasLasReglas()) {
            throw new IllegalStateException("La asignatura modificada no cumple las reglas OCL");
        }

        registrarOperacion("Modificada asignatura: " + asignatura.getCodigo());
        return asignatura;
    }

    /**
     * Activa o desactiva una asignatura
     */
    public void cambiarEstadoAsignatura(Asignatura asignatura, boolean activa) {
        log.info("Administrador cambiando estado de asignatura {} a {}",
                asignatura.getCodigo(), activa ? "ACTIVA" : "INACTIVA");

        asignatura.setActiva(activa);

        // Si se desactiva, limpiar horarios (regla OCL)
        if (!activa) {
            asignatura.limpiarHorarios();
        }

        registrarOperacion("Cambiado estado de asignatura " + asignatura.getCodigo() +
                " a " + (activa ? "ACTIVA" : "INACTIVA"));
    }

    /**
     * Crea un nuevo plan de estudios
     */
    public PlanEstudios crearPlanEstudios(String codigo, String nombre,
                                          Integer duracionSemestres, String programa) {
        log.info("Administrador creando plan de estudios: {}", codigo);

        PlanEstudios plan = planEstudiosBuilder.reset()
                .informacionBasica(codigo, nombre, duracionSemestres)
                .facultadPrograma("Facultad por definir", programa)
                .obtenerPlan();

        registrarOperacion("Creado plan de estudios: " + codigo);
        return plan;
    }

    /**
     * Agrega una asignatura a un plan de estudios
     */
    public void agregarAsignaturaAPlan(PlanEstudios plan, Asignatura asignatura,
                                       Integer numeroSemestre) {
        log.info("Administrador agregando asignatura {} al plan {} semestre {}",
                asignatura.getCodigo(), plan.getCodigo(), numeroSemestre);

        // Buscar el semestre correspondiente
        plan.getSemestres().stream()
                .filter(s -> numeroSemestre.equals(s.getNumero()))
                .findFirst()
                .ifPresentOrElse(
                        semestre -> {
                            semestre.agregarAsignatura(asignatura);
                            registrarOperacion("Agregada asignatura " + asignatura.getCodigo() +
                                    " al plan " + plan.getCodigo() + " semestre " + numeroSemestre);
                        },
                        () -> {
                            throw new IllegalArgumentException("No existe el semestre " + numeroSemestre +
                                    " en el plan " + plan.getCodigo());
                        }
                );
    }

    /**
     * Valida un plan de estudios completo
     */
    public boolean validarPlanEstudios(PlanEstudios plan) {
        log.info("Administrador validando plan de estudios: {}", plan.getCodigo());

        boolean esValido = plan.validarTodasLasReglas();

        registrarOperacion("Validado plan de estudios: " + plan.getCodigo() +
                " - Resultado: " + (esValido ? "VÁLIDO" : "INVÁLIDO"));

        return esValido;
    }

    /**
     * Obtiene estadísticas del sistema
     */
    public String obtenerEstadisticas() {
        return String.format("Administrador: %s%nOperaciones realizadas: %d%nÚltima actividad: %s",
                nombre, operacionesRealizadas.size(),
                operacionesRealizadas.isEmpty() ? "Ninguna" :
                        operacionesRealizadas.get(operacionesRealizadas.size() - 1));
    }

    /**
     * Registra una operación realizada
     */
    private void registrarOperacion(String operacion) {
        String operacionConFecha = LocalDateTime.now() + " - " + operacion;
        operacionesRealizadas.add(operacionConFecha);
        log.debug("Operación registrada: {}", operacion);
    }

    // Getters
    public String getId() { return id; }
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
    public LocalDateTime getFechaInicioSesion() { return fechaInicioSesion; }
    public List<String> getOperacionesRealizadas() {
        return new ArrayList<>(operacionesRealizadas);
    }

    /**
     * Previene la clonación del Singleton
     */
    @Override
    protected Object clone() throws CloneNotSupportedException {
        throw new CloneNotSupportedException("No se puede clonar un Singleton");
    }

    @Override
    public String toString() {
        return "Administrador{" +
                "id='" + id + '\'' +
                ", nombre='" + nombre + '\'' +
                ", operaciones=" + operacionesRealizadas.size() +
                '}';
    }
}