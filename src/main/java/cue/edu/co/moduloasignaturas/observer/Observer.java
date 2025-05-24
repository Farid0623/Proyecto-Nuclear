package cue.edu.co.moduloasignaturas.observer;

/**
 * Interfaz Observer para el patrón Observer
 * Define el metodo de actualización para observadores
 */
public interface Observer {

    /**
     * Metodo llamado cuando el sujeto notifica cambios
     * @param mensaje mensaje de notificación
     * @param tipo tipo de cambio realizado
     * @param datos datos adicionales del cambio
     */
    void actualizar(String mensaje, TipoCambio tipo, Object datos);
}