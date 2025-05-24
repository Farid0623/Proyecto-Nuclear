package cue.edu.co.moduloasignaturas.model;

/**
 * Interfaz para el patrón Composite
 * Permite tratar de manera uniforme PlanEstudios, Semestre y Asignatura
 */
public interface ComponentePlan {

    /**
     * Muestra los detalles del componente
     */
    void mostrarDetalles();

    /**
     * Calcula los créditos totales del componente
     * @return número total de créditos
     */
    int calcularCreditos();

    /**
     * Agrega un componente hijo (solo para composites)
     * @param componente el componente a agregar
     */
    void agregarComponente(ComponentePlan componente);
}