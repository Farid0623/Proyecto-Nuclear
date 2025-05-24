package cue.edu.co.moduloasignaturas.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;

/**
 * Clase que representa la matrícula de un estudiante en una asignatura
 * Incluye información de calificaciones y estado académico
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AsignaturaMatriculada {

    @DBRef
    private Asignatura asignatura;

    private LocalDateTime fechaMatricula;

    private EstadoMatricula estado;

    // Calificaciones
    private Double notaParcial1;
    private Double notaParcial2;
    private Double notaFinal;
    private Double notaDefinitiva;

    // Información adicional
    private Integer numeroIntentos;
    private String observaciones;

    /**
     * Verifica si la asignatura fue aprobada
     * OCL: Implementa la verificación de aprobación
     */
    public boolean verificarAprobacion() {
        return estado == EstadoMatricula.APROBADA &&
                notaDefinitiva != null &&
                notaDefinitiva >= 3.0;
    }

    /**
     * Calcula la nota definitiva basada en parciales
     */
    public void calcularNotaDefinitiva() {
        if (notaParcial1 != null && notaParcial2 != null && notaFinal != null) {
            // Fórmula típica: 30% + 30% + 40%
            notaDefinitiva = (notaParcial1 * 0.3) + (notaParcial2 * 0.3) + (notaFinal * 0.4);

            // Determinar estado basado en la nota
            if (notaDefinitiva >= 3.0) {
                estado = EstadoMatricula.APROBADA;
            } else {
                estado = EstadoMatricula.REPROBADA;
            }
        }
    }

    /**
     * Verifica si está actualmente matriculada
     */
    public boolean estaMatriculada() {
        return estado == EstadoMatricula.MATRICULADA;
    }

    @Override
    public String toString() {
        return "AsignaturaMatriculada{" +
                "asignatura=" + (asignatura != null ? asignatura.getCodigo() : "null") +
                ", estado=" + estado +
                ", notaDefinitiva=" + notaDefinitiva +
                '}';
    }
}