package cue.edu.co.moduloasignaturas.model.state;

import cue.edu.co.moduloasignaturas.model.Asignatura;

/**
 * Interfaz para el patrón State
 * Define el comportamiento común para los estados de una asignatura
 */
public interface EstadoAsignatura {

    /**
     * Ejecuta la acción específica del estado
     * @param asignatura la asignatura en este estado
     */
    void accion(Asignatura asignatura);

    /**
     * Indica si la asignatura está activa en este estado
     * @return true si está activa, false en caso contrario
     */
    boolean esActiva();

    /**
     * Obtiene el nombre del estado
     * @return nombre descriptivo del estado
     */
    String getNombreEstado();
}