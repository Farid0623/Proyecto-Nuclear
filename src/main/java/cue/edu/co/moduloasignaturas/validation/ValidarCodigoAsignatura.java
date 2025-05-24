package cue.edu.co.moduloasignaturas.validation;

import org.springframework.stereotype.Component;

/**
 * Validador que verifica el formato del código de asignatura
 * OCL: inv codigoValido: self.codigo.size() >= 3 and self.codigo.size() <= 10
 */
@Component
public class ValidarCodigoAsignatura extends ManejadorBase {

    private static final String PATRON_CODIGO = "^[A-Za-z0-9]+$";

    @Override
    protected boolean manejar(SolicitudValidacion solicitud) {
        logValidacion("Validando formato del código");

        Object codigoObj = solicitud.getAtributo("codigo");

        if (codigoObj == null) {
            solicitud.agregarError("codigo", "El código es obligatorio");
            logError("Código no proporcionado");
            return false;
        }

        String codigo = codigoObj.toString().trim();

        // Validar longitud
        if (codigo.length() < 3) {
            solicitud.agregarError("codigo", "El código debe tener al menos 3 caracteres");
            logError("Código muy corto: " + codigo);
            return false;
        }

        if (codigo.length() > 10) {
            solicitud.agregarError("codigo", "El código no puede tener más de 10 caracteres");
            logError("Código muy largo: " + codigo);
            return false;
        }

        // Validar formato alfanumérico
        if (!codigo.matches(PATRON_CODIGO)) {
            solicitud.agregarError("codigo", "El código solo puede contener letras y números");
            logError("Código con formato inválido: " + codigo);
            return false;
        }

        logValidacion("Código válido: " + codigo);
        return true;
    }
}