package cue.edu.co.moduloasignaturas.validation;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Map;
import java.util.HashMap;

/**
 * Solicitud que contiene los datos para validación
 * Utilizada en el patrón Chain of Responsibility
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudValidacion {

    // Atributos principales
    private Map<String, Object> atributos;

    // Errores encontrados durante la validación
    @Builder.Default
    private Map<String, String> errores = new HashMap<>();

    /**
     * Obtiene un atributo por su clave
     */
    public Object getAtributo(String clave) {
        return atributos != null ? atributos.get(clave) : null;
    }

    /**
     * Establece un atributo
     */
    public void setAtributo(String clave, Object valor) {
        if (atributos == null) {
            atributos = new HashMap<>();
        }
        atributos.put(clave, valor);
    }

    /**
     * Agrega un error de validación
     */
    public void agregarError(String campo, String mensaje) {
        errores.put(campo, mensaje);
    }

    /**
     * Verifica si hay errores
     */
    public boolean tieneErrores() {
        return errores != null && !errores.isEmpty();
    }

    /**
     * Obtiene todos los errores como un string
     */
    public String obtenerMensajeErrores() {
        if (!tieneErrores()) {
            return "";
        }

        StringBuilder sb = new StringBuilder();
        errores.forEach((campo, mensaje) ->
                sb.append(campo).append(": ").append(mensaje).append("; ")
        );
        return sb.toString();
    }
}