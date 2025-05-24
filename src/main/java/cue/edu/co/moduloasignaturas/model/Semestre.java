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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

/**
 * Entidad Semestre que implementa las reglas OCL:
 * - numeroValido: self.numero > 0 and self.numero <= self.planEstudios.duracionSemestres
 * - tieneAsignaturas: self.asignatura->notEmpty()
 * - creditosPorSemestreValidos: self.asignatura->sum(a | a.creditos) >= 12 and <= 20
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "semestres")
public class Semestre implements ComponentePlan {

    private static final Logger logger = LoggerFactory.getLogger(Semestre.class);

    @Id
    private String id;

    @Positive(message = "El número de semestre debe ser positivo")
    private Integer numero;

    @NotBlank(message = "El nombre del semestre es obligatorio")
    private String nombre;

    private String descripcion;

    // Referencias a asignaturas del semestre
    @DBRef
    @Builder.Default
    @NotEmpty(message = "Un semestre debe tener al menos una asignatura")
    private List<Asignatura> asignaturas = new ArrayList<>();

    // Referencia al plan de estudios padre
    private String planEstudiosId;

    @CreatedDate
    private LocalDateTime fechaCreacion;

    @LastModifiedDate
    private LocalDateTime fechaModificacion;

    // Métodos de validación OCL

    /**
     * Valida que el número de semestre sea válido
     * OCL: inv numeroValido: self.numero > 0 and self.numero <= self.planEstudios.duracionSemestres
     * Nota: La validación completa requiere acceso al PlanEstudios
     */
    public boolean validarNumeroValido(Integer duracionMaxima) {
        return numero != null && numero > 0 &&
                (duracionMaxima == null || numero <= duracionMaxima);
    }

    /**
     * Valida que el semestre tenga asignaturas
     * OCL: inv tieneAsignaturas: self.asignatura->notEmpty()
     */
    public boolean validarTieneAsignaturas() {
        return asignaturas != null && !asignaturas.isEmpty();
    }

    /**
     * Valida que los créditos por semestre estén en rango válido
     * OCL: inv creditosPorSemestreValidos:
     *      self.asignatura->sum(a | a.creditos) >= 12 and <= 20
     */
    public boolean validarCreditosPorSemestreValidos() {
        int creditosTotales = calcularCreditos();
        return creditosTotales >= 12 && creditosTotales <= 20;
    }

    /**
     * Valida todas las reglas OCL del semestre
     */
    public boolean validarTodasLasReglas(Integer duracionMaximaPlan) {
        return validarNumeroValido(duracionMaximaPlan) &&
                validarTieneAsignaturas() &&
                validarCreditosPorSemestreValidos();
    }

    // Métodos del patrón Composite
    @Override
    public void mostrarDetalles() {
        logger.info("Semestre {}: {}", numero, nombre);
        logger.info("Créditos totales: {}", calcularCreditos());
        logger.info("Asignaturas:");
        if (asignaturas != null) {
            asignaturas.forEach(ComponentePlan::mostrarDetalles);
        }
    }

    @Override
    public int calcularCreditos() {
        if (asignaturas == null || asignaturas.isEmpty()) {
            return 0;
        }
        return asignaturas.stream()
                .mapToInt(ComponentePlan::calcularCreditos)
                .sum();
    }

    @Override
    public void agregarComponente(ComponentePlan componente) {
        if (componente instanceof Asignatura) {
            agregarAsignatura((Asignatura) componente);
        } else {
            throw new IllegalArgumentException("Solo se pueden agregar Asignaturas a un Semestre");
        }
    }

    // Métodos específicos para manejo de asignaturas
    public void agregarAsignatura(Asignatura asignatura) {
        if (asignatura != null) {
            if (asignaturas == null) {
                asignaturas = new ArrayList<>();
            }
            if (!asignaturas.contains(asignatura)) {
                asignaturas.add(asignatura);
                asignatura.setNumeroSemestre(this.numero);
            }
        }
    }

    public void removerAsignatura(Asignatura asignatura) {
        if (asignaturas != null) {
            asignaturas.remove(asignatura);
        }
    }

    public List<Asignatura> obtenerAsignaturas() {
        return asignaturas != null ? new ArrayList<>(asignaturas) : new ArrayList<>();
    }

    public boolean contieneAsignatura(String codigoAsignatura) {
        return asignaturas != null &&
                asignaturas.stream()
                        .anyMatch(a -> a.getCodigo().equals(codigoAsignatura));
    }

    @Override
    public String toString() {
        return "Semestre{" +
                "numero=" + numero +
                ", nombre='" + nombre + '\'' +
                ", asignaturas=" + (asignaturas != null ? asignaturas.size() : 0) +
                ", creditos=" + calcularCreditos() +
                '}';
    }
}