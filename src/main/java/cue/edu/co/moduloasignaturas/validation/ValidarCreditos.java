package cue.edu.co.moduloasignaturas.validation;

import org.springframework.stereotype.Component;

/**
 * Validador que verifica que los créditos sean positivos
 * OCL: inv creditosPositivos: self.creditos > 0
 */
@Component
public class ValidarCreditos extends ManejadorBase {

    @Override
    protected boolean manejar(SolicitudValidacion solicitud) {
        logValidacion("Validando créditos positivos");

        Object creditosObj = solicitud.getAtributo("creditos");

        if (creditosObj == null) {
            solicitud.agregarError("creditos", "Los créditos son obligatorios");
            logError("Créditos no proporcionados");
            return false;
        }

        try {
            Integer creditos = (Integer) creditosObj;

            if (creditos <= 0) {
                solicitud.agregarError("creditos", "Los créditos deben ser positivos (mayor a 0)");
                logError("Créditos no positivos: " + creditos);
                return false;
            }

            if (creditos > 10) {
                solicitud.agregarError("creditos", "Los créditos no pueden exceder 10");
                logError("Créditos exceden el máximo: " + creditos);
                return false;
            }

            logValidacion("Créditos válidos: " + creditos);
            return true;

        } catch (ClassCastException e) {
            solicitud.agregarError("creditos", "Los créditos deben ser un número entero");
            logError("Tipo de datos incorrecto para créditos");
            return false;
        }
    }
}