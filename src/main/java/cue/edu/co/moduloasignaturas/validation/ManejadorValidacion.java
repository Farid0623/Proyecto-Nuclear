package cue.edu.co.moduloasignaturas.validation;

/**
 * Interfaz para el patrón Chain of Responsibility
 * Define la estructura para validadores en cadena
 */
public interface ManejadorValidacion {

    /**
     * Establece el siguiente manejador en la cadena
     * @param siguiente el siguiente manejador
     */
    void setSiguiente(ManejadorValidacion siguiente);

    /**
     * Procesa la solicitud de validación
     * @param solicitud la solicitud a procesar
     * @return true si la validación pasa, false en caso contrario
     */
    boolean procesar(SolicitudValidacion solicitud);
}