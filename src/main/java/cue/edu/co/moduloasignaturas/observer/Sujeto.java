package cue.edu.co.moduloasignaturas.observer;

/**
 * Interfaz Sujeto para el patrón Observer
 * Define métodos para manejar observadores
 */
public interface Sujeto {

    /**
     * Agrega un observador a la lista
     * @param observador el observador a agregar
     */
    void agregarObservador(Observer observador);

    /**
     * Elimina un observador de la lista
     * @param observador el observador a eliminar
     */
    void eliminarObservador(Observer observador);

    /**
     * Notifica a todos los observadores sobre un cambio
     * @param mensaje mensaje de notificación
     * @param tipo tipo de cambio
     * @param datos datos adicionales
     */
    void notificar(String mensaje, TipoCambio tipo, Object datos);
}