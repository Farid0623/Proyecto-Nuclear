package cue.edu.co.moduloasignaturas.model;

/**
 * Interfaz ComponentePlan para implementar el patrón Composite
 * Permite tratar uniformemente a Semestres y Asignaturas
 */
public interface ComponentePlan {

    /**
     * Muestra los detalles del componente
     */
    void mostrarDetalles();

    /**
     * Calcula el total de créditos del componente
     * @return número de créditos
     */
    int calcularCreditos();

    /**
     * Agrega un componente hijo (para implementaciones que lo soporten)
     * @param componente el componente a agregar
     */
    default void agregarComponente(ComponentePlan componente) {
        throw new UnsupportedOperationException("Esta operación no está soportada");
    }
}