package cue.edu.co.moduloasignaturas.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Clase base que implementa la lógica común del Chain of Responsibility
 */
public abstract class ManejadorBase implements ManejadorValidacion {

    private static final Logger log = LoggerFactory.getLogger(ManejadorBase.class);

    private ManejadorValidacion siguiente;

    @Override
    public void setSiguiente(ManejadorValidacion siguiente) {
        this.siguiente = siguiente;
    }

    @Override
    public boolean procesar(SolicitudValidacion solicitud) {
        // Procesar la validación actual
        boolean resultado = manejar(solicitud);

        // Si la validación actual pasa, continuar con el siguiente
        if (resultado && siguiente != null) {
            return siguiente.procesar(solicitud);
        }

        // Si falló la validación o no hay siguiente, retornar el resultado
        return resultado;
    }

    /**
     * Método abstracto que debe implementar cada validador específico
     * @param solicitud la solicitud a validar
     * @return true si la validación pasa, false en caso contrario
     */
    protected abstract boolean manejar(SolicitudValidacion solicitud);

    /**
     * Obtiene el nombre del validador para logging
     */
    protected String getNombreValidador() {
        return this.getClass().getSimpleName();
    }

    /**
     * Registra información de la validación
     */
    protected void logValidacion(String mensaje) {
        log.debug("{}: {}", getNombreValidador(), mensaje);
    }

    /**
     * Registra errores de validación
     */
    protected void logError(String mensaje) {
        log.warn("{}: {}", getNombreValidador(), mensaje);
    }
}