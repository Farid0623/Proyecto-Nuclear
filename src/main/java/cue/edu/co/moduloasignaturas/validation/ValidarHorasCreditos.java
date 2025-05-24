package cue.edu.co.moduloasignaturas.validation;

import org.springframework.stereotype.Component;

/**
 * Validador que verifica consistencia entre horas y créditos
 * OCL: inv horasConsistentes: self.horasTeoricas + self.horasPracticas = self.creditos * 16
 */
@Component
public class ValidarHorasCreditos extends ManejadorBase {

    private static final int HORAS_POR_CREDITO = 16;

    @Override
    protected boolean manejar(SolicitudValidacion solicitud) {
        logValidacion("Validando consistencia entre horas y créditos");

        Object creditosObj = solicitud.getAtributo("creditos");
        Object horasTeoriObj = solicitud.getAtributo("horasTeoricas");
        Object horasPractObj = solicitud.getAtributo("horasPracticas");

        if (creditosObj == null || horasTeoriObj == null || horasPractObj == null) {
            solicitud.agregarError("horas", "Créditos, horas teóricas y prácticas son obligatorios para validación");
            logError("Datos insuficientes para validar consistencia");
            return false;
        }

        try {
            Integer creditos = (Integer) creditosObj;
            Integer horasTeoricas = (Integer) horasTeoriObj;
            Integer horasPracticas = (Integer) horasPractObj;

            // Validar que las horas no sean negativas
            if (horasTeoricas < 0) {
                solicitud.agregarError("horasTeoricas", "Las horas teóricas no pueden ser negativas");
                logError("Horas teóricas negativas: " + horasTeoricas);
                return false;
            }

            if (horasPracticas < 0) {
                solicitud.agregarError("horasPracticas", "Las horas prácticas no pueden ser negativas");
                logError("Horas prácticas negativas: " + horasPracticas);
                return false;
            }

            // Validar consistencia: horasTeoricas + horasPracticas = creditos * 16
            int horasTotales = horasTeoricas + horasPracticas;
            int horasEsperadas = creditos * HORAS_POR_CREDITO;

            if (horasTotales != horasEsperadas) {
                String mensaje = String.format(
                        "Las horas totales (%d) deben ser igual a créditos * %d = %d",
                        horasTotales, HORAS_POR_CREDITO, horasEsperadas);
                solicitud.agregarError("horas", mensaje);
                logError(mensaje);
                return false;
            }

            logValidacion(String.format("Consistencia válida: %d horas teóricas + %d horas prácticas = %d créditos * %d",
                    horasTeoricas, horasPracticas, creditos, HORAS_POR_CREDITO));
            return true;

        } catch (ClassCastException e) {
            solicitud.agregarError("horas", "Los valores de horas y créditos deben ser números enteros");
            logError("Tipo de datos incorrecto para validación de horas");
            return false;
        }
    }
}