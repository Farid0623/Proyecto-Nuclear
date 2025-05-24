package cue.edu.co.moduloasignaturas.service;

import cue.edu.co.moduloasignaturas.validation.*;
import cue.edu.co.moduloasignaturas.model.Asignatura;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * Servicio que coordina las validaciones usando Chain of Responsibility
 * Implementa todas las reglas OCL para asignaturas
 */
@Service
public class ServicioValidacion {

    private static final Logger log = LoggerFactory.getLogger(ServicioValidacion.class);

    @Autowired
    private ValidarCreditos validarCreditos;

    @Autowired
    private ValidarCodigoAsignatura validarCodigo;

    @Autowired
    private ValidarHorasCreditos validarHoras;

    private ManejadorValidacion cadenaValidacion;

    /**
     * Inicializa la cadena de validación
     */
    public void inicializarCadena() {
        // Construir la cadena: Créditos -> Código -> Horas
        validarCreditos.setSiguiente(validarCodigo);
        validarCodigo.setSiguiente(validarHoras);

        cadenaValidacion = validarCreditos;

        log.info("Cadena de validación inicializada: Créditos -> Código -> Horas");
    }

    /**
     * Valida una asignatura usando la cadena de responsabilidad
     */
    public ResultadoValidacion validarAsignatura(Asignatura asignatura) {
        if (cadenaValidacion == null) {
            inicializarCadena();
        }

        log.info("Iniciando validación de asignatura: {}", asignatura.getCodigo());

        // Crear solicitud con los datos de la asignatura
        SolicitudValidacion solicitud = crearSolicitudAsignatura(asignatura);

        // Procesar a través de la cadena
        boolean esValida = cadenaValidacion.procesar(solicitud);

        // Crear resultado
        ResultadoValidacion resultado = new ResultadoValidacion(esValida, solicitud.getErrores());

        if (esValida) {
            log.info("Asignatura {} validada exitosamente", asignatura.getCodigo());
        } else {
            log.warn("Asignatura {} falló validación: {}",
                    asignatura.getCodigo(), solicitud.obtenerMensajeErrores());
        }

        return resultado;
    }

    /**
     * Valida datos de asignatura sin crear objeto
     */
    public ResultadoValidacion validarDatosAsignatura(String codigo, String nombre,
                                                      Integer creditos, Integer horasTeoricas,
                                                      Integer horasPracticas) {
        if (cadenaValidacion == null) {
            inicializarCadena();
        }

        log.info("Iniciando validación de datos de asignatura: {}", codigo);

        // Crear solicitud con los datos proporcionados
        SolicitudValidacion solicitud = SolicitudValidacion.builder()
                .atributos(new HashMap<>())
                .build();

        solicitud.setAtributo("codigo", codigo);
        solicitud.setAtributo("nombre", nombre);
        solicitud.setAtributo("creditos", creditos);
        solicitud.setAtributo("horasTeoricas", horasTeoricas);
        solicitud.setAtributo("horasPracticas", horasPracticas);

        // Procesar a través de la cadena
        boolean esValida = cadenaValidacion.procesar(solicitud);

        // Crear resultado
        ResultadoValidacion resultado = new ResultadoValidacion(esValida, solicitud.getErrores());

        if (esValida) {
            log.info("Datos de asignatura {} validados exitosamente", codigo);
        } else {
            log.warn("Datos de asignatura {} fallaron validación: {}",
                    codigo, solicitud.obtenerMensajeErrores());
        }

        return resultado;
    }

    /**
     * Crea una solicitud de validación a partir de una asignatura
     */
    private SolicitudValidacion crearSolicitudAsignatura(Asignatura asignatura) {
        Map<String, Object> atributos = new HashMap<>();
        atributos.put("codigo", asignatura.getCodigo());
        atributos.put("nombre", asignatura.getNombre());
        atributos.put("creditos", asignatura.getCreditos());
        atributos.put("horasTeoricas", asignatura.getHorasTeoricas());
        atributos.put("horasPracticas", asignatura.getHorasPracticas());
        atributos.put("descripcion", asignatura.getDescripcion());
        atributos.put("activa", asignatura.getActiva());

        return SolicitudValidacion.builder()
                .atributos(atributos)
                .build();
    }

    /**
     * Agrega un validador personalizado a la cadena
     */
    public void agregarValidador(ManejadorValidacion validador) {
        if (cadenaValidacion == null) {
            inicializarCadena();
        }

        // Encontrar el último validador en la cadena
        ManejadorValidacion ultimo = cadenaValidacion;
        // En una implementación más completa, recorreríamos la cadena
        // Para simplicidad, agregamos al final de la cadena existente
        validarHoras.setSiguiente(validador);

        log.info("Validador personalizado agregado a la cadena: {}",
                validador.getClass().getSimpleName());
    }

    /**
     * Clase interna para el resultado de validación
     */
    public static class ResultadoValidacion {
        private final boolean esValido;
        private final Map<String, String> errores;

        public ResultadoValidacion(boolean esValido, Map<String, String> errores) {
            this.esValido = esValido;
            this.errores = errores != null ? new HashMap<>(errores) : new HashMap<>();
        }

        public boolean esValido() {
            return esValido;
        }

        public Map<String, String> getErrores() {
            return new HashMap<>(errores);
        }

        public String getMensajeErrores() {
            if (errores.isEmpty()) {
                return "";
            }

            StringBuilder sb = new StringBuilder();
            errores.forEach((campo, mensaje) ->
                    sb.append(campo).append(": ").append(mensaje).append("; ")
            );
            return sb.toString();
        }

        public boolean tieneErrores() {
            return !errores.isEmpty();
        }
    }
}