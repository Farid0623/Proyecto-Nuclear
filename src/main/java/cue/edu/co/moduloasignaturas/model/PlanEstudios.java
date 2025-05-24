package cue.edu.co.moduloasignaturas.model;

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

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotEmpty;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;
import java.util.stream.Collectors;

/**
 * Entidad PlanEstudios que implementa las reglas OCL:
 * - duracionValida: self.duracionSemestres >= 8 and self.duracionSemestres <= 12
 * - tieneSemestres: self.semestre->notEmpty()
 * - semestreUnico: self.semestre->forAll(s1, s2 | s1 <> s2 implies s1.numero <> s2.numero)
 * - creditosTotalesValidos: self.semestre->collect(s | s.asignatura)->flatten()->sum(a | a.creditos) <= 200
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "planes_estudios")
public class PlanEstudios implements ComponentePlan {

    @Id
    private String id;

    @NotBlank(message = "El nombre del plan de estudios es obligatorio")
    @Indexed(unique = true)
    private String nombre;

    @NotBlank(message = "El código del plan es obligatorio")
    @Indexed(unique = true)
    private String codigo;

    @Min(value = 8, message = "La duración mínima es de 8 semestres")
    @Max(value = 12, message = "La duración máxima es de 12 semestres")
    private Integer duracionSemestres;

    private String descripcion;

    private String facultad;

    private String programa;

    private Boolean activo = true;

    // Referencias a semestres del plan
    @DBRef
    @Builder.Default
    @NotEmpty(message = "Un plan de estudios debe tener al menos un semestre")
    private List<Semestre> semestres = new ArrayList<>();

    @CreatedDate
    private LocalDateTime fechaCreacion;

    @LastModifiedDate
    private LocalDateTime fechaModificacion;

    // Métodos de validación OCL

    /**
     * Valida que la duración esté en rango válido
     * OCL: inv duracionValida: self.duracionSemestres >= 8 and self.duracionSemestres <= 12
     */
    public boolean validarDuracionValida() {
        return duracionSemestres != null &&
                duracionSemestres >= 8 &&
                duracionSemestres <= 12;
    }

    /**
     * Valida que el plan tenga semestres
     * OCL: inv tieneSemestres: self.semestre->notEmpty()
     */
    public boolean validarTieneSemestres() {
        return semestres != null && !semestres.isEmpty();
    }

    /**
     * Valida que cada semestre tenga un número único
     * OCL: inv semestreUnico: self.semestre->forAll(s1, s2 | s1 <> s2 implies s1.numero <> s2.numero)
     */
    public boolean validarSemestreUnico() {
        if (semestres == null || semestres.isEmpty()) {
            return true;
        }

        Set<Integer> numerosUnicos = new HashSet<>();
        for (Semestre semestre : semestres) {
            if (semestre.getNumero() == null || !numerosUnicos.add(semestre.getNumero())) {
                return false;
            }
        }
        return true;
    }

    /**
     * Valida que los créditos totales no excedan el máximo
     * OCL: inv creditosTotalesValidos:
     *      self.semestre->collect(s | s.asignatura)->flatten()->sum(a | a.creditos) <= 200
     */
    public boolean validarCreditosTotalesValidos() {
        int creditosTotales = calcularCreditos();
        return creditosTotales <= 200;
    }

    /**
     * Valida todas las reglas OCL del plan de estudios
     */
    public boolean validarTodasLasReglas() {
        return validarDuracionValida() &&
                validarTieneSemestres() &&
                validarSemestreUnico() &&
                validarCreditosTotalesValidos();
    }

    // Métodos del patrón Composite
    @Override
    public void mostrarDetalles() {
        System.out.println("Plan de Estudios: " + nombre + " (" + codigo + ")");
        System.out.println("Duración: " + duracionSemestres + " semestres");
        System.out.println("Créditos totales: " + calcularCreditos());
        System.out.println("Semestres:");
        if (semestres != null) {
            semestres.forEach(ComponentePlan::mostrarDetalles);
        }
    }

    @Override
    public int calcularCreditos() {
        if (semestres == null || semestres.isEmpty()) {
            return 0;
        }
        return semestres.stream()
                .mapToInt(ComponentePlan::calcularCreditos)
                .sum();
    }

    @Override
    public void agregarComponente(ComponentePlan componente) {
        if (componente instanceof Semestre) {
            agregarSemestre((Semestre) componente);
        } else {
            throw new IllegalArgumentException("Solo se pueden agregar Semestres a un PlanEstudios");
        }
    }

    // Métodos específicos para manejo de semestres
    public void agregarSemestre(Semestre semestre) {
        if (semestre != null) {
            if (semestres == null) {
                semestres = new ArrayList<>();
            }
            if (!semestres.contains(semestre)) {
                semestres.add(semestre);
                semestre.setPlanEstudiosId(this.id);
            }
        }
    }

    public void removerSemestre(Semestre semestre) {
        if (semestres != null) {
            semestres.remove(semestre);
        }
    }

    public List<Semestre> obtenerSemestres() {
        return semestres != null ? new ArrayList<>(semestres) : new ArrayList<>();
    }

    // Métodos de consulta OCL

    /**
     * Obtiene las asignaturas de un semestre específico
     * OCL: obtenerAsignaturasPorSemestre(semestre: Integer): Set(Asignatura)
     * pre: semestre > 0 and semestre <= self.duracionSemestres
     * post: result = self.semestre->select(s | s.numero = semestre).asignatura->asSet()
     */
    public Set<Asignatura> obtenerAsignaturasPorSemestre(Integer numeroSemestre) {
        // Precondición
        if (numeroSemestre == null || numeroSemestre <= 0 ||
                (duracionSemestres != null && numeroSemestre > duracionSemestres)) {
            throw new IllegalArgumentException("Número de semestre inválido");
        }

        return semestres.stream()
                .filter(s -> numeroSemestre.equals(s.getNumero()))
                .flatMap(s -> s.getAsignaturas().stream())
                .collect(Collectors.toSet());
    }

    /**
     * Verifica si un estudiante cumple los prerrequisitos para una asignatura
     * OCL: verificarRequisitos(estudiante: Estudiante, asignatura: Asignatura): Boolean
     */
    public boolean verificarRequisitos(Estudiante estudiante, Asignatura asignatura) {
        if (estudiante == null || asignatura == null) {
            throw new IllegalArgumentException("Estudiante y asignatura no pueden ser nulos");
        }

        List<Asignatura> prerrequisitos = asignatura.obtenerPrerrequisitos();
        if (prerrequisitos.isEmpty()) {
            return true;
        }

        return prerrequisitos.stream().allMatch(prereq ->
                estudiante.getAsignaturasMatriculadas().stream()
                        .anyMatch(am -> am.getAsignatura().equals(prereq) && am.verificarAprobacion())
        );
    }

    /**
     * Obtiene todas las asignaturas del plan
     */
    public List<Asignatura> obtenerTodasLasAsignaturas() {
        return semestres.stream()
                .flatMap(s -> s.getAsignaturas().stream())
                .collect(Collectors.toList());
    }

    /**
     * Busca una asignatura por código
     */
    public Asignatura buscarAsignaturaPorCodigo(String codigo) {
        return obtenerTodasLasAsignaturas().stream()
                .filter(a -> a.getCodigo().equals(codigo))
                .findFirst()
                .orElse(null);
    }

    /**
     * Valida que los prerrequisitos estén en el mismo plan
     * OCL: prerequisitosEnMismoPlan
     */
    public boolean validarPrerequisitosEnMismoPlan() {
        List<Asignatura> todasLasAsignaturas = obtenerTodasLasAsignaturas();

        return todasLasAsignaturas.stream().allMatch(asignatura ->
                asignatura.obtenerPrerrequisitos().stream()
                        .allMatch(todasLasAsignaturas::contains)
        );
    }

    /**
     * Valida que asignaturas con prerrequisitos no estén en primer semestre
     * OCL: prerrequisitosNoEnPrimerSemestre
     */
    public boolean validarPrerequisitosNoEnPrimerSemestre() {
        return semestres.stream()
                .filter(s -> s.getNumero() != null && s.getNumero() == 1)
                .flatMap(s -> s.getAsignaturas().stream())
                .allMatch(a -> a.obtenerPrerrequisitos().isEmpty());
    }

    @Override
    public String toString() {
        return "PlanEstudios{" +
                "codigo='" + codigo + '\'' +
                ", nombre='" + nombre + '\'' +
                ", duracionSemestres=" + duracionSemestres +
                ", semestres=" + (semestres != null ? semestres.size() : 0) +
                ", creditos=" + calcularCreditos() +
                '}';
    }
}