package cue.edu.co.moduloasignaturas.model;

/**
 * Estados posibles de una matrícula de asignatura
 */
public enum EstadoMatricula {
    MATRICULADA("Matriculada"),
    APROBADA("Aprobada"),
    REPROBADA("Reprobada"),
    CANCELADA("Cancelada"),
    RETIRADA("Retirada");

    private final String descripcion;

    EstadoMatricula(String descripcion) {
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