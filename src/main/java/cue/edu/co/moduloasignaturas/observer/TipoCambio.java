package cue.edu.co.moduloasignaturas.observer;

/**
 * Tipos de cambios que pueden ocurrir en el pensum
 */
public enum TipoCambio {
    ASIGNATURA_AGREGADA("Asignatura Agregada"),
    ASIGNATURA_ELIMINADA("Asignatura Eliminada"),
    ASIGNATURA_MODIFICADA("Asignatura Modificada"),
    ASIGNATURA_ACTIVADA("Asignatura Activada"),
    ASIGNATURA_DESACTIVADA("Asignatura Desactivada"),
    PLAN_CREADO("Plan de Estudios Creado"),
    PLAN_MODIFICADO("Plan de Estudios Modificado"),
    SEMESTRE_AGREGADO("Semestre Agregado"),
    SEMESTRE_MODIFICADO("Semestre Modificado"),
    HORARIO_CAMBIADO("Horario Cambiado"),
    PRERREQUISITO_AGREGADO("Prerrequisito Agregado"),
    PRERREQUISITO_ELIMINADO("Prerrequisito Eliminado");

    private final String descripcion;

    TipoCambio(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }

    @Override
    public String toString() {
        return descripcion;
    }
}