package cue.edu.co.moduloasignaturas.factory;

import cue.edu.co.moduloasignaturas.model.Asignatura;
import cue.edu.co.moduloasignaturas.model.state.AsignaturaActiva;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Implementación concreta del Factory para crear asignaturas
 * Encapsula la lógica de validación y creación de asignaturas según reglas OCL
 */
@Component
public class AsignaturaFactoryImpl implements AsignaturaFactory {

    private static final Logger log = LoggerFactory.getLogger(AsignaturaFactoryImpl.class);

    @Override
    public Asignatura crearAsignatura(String codigo, String nombre, Integer creditos,
                                      Integer horasTeoricas, Integer horasPracticas) {

        log.info("Creando asignatura: código={}, nombre={}, créditos={}",
                codigo, nombre, creditos);

        // Crear la asignatura
        Asignatura asignatura = Asignatura.builder()
                .codigo(codigo)
                .nombre(nombre)
                .creditos(creditos)
                .horasTeoricas(horasTeoricas)
                .horasPracticas(horasPracticas)
                .activa(true)
                .estado(new AsignaturaActiva())
                .build();

        // Validar reglas OCL
        validarReglasOCL(asignatura);

        log.info("Asignatura creada exitosamente: {}", asignatura.getCodigo());
        return asignatura;
    }

    /**
     * Valida todas las reglas OCL de la asignatura
     */
    private void validarReglasOCL(Asignatura asignatura) {
        StringBuilder errores = new StringBuilder();

        // Validar créditos positivos
        if (!asignatura.validarCreditosPositivos()) {
            errores.append("Los créditos deben ser positivos. ");
        }

        // Validar código válido
        if (!asignatura.validarCodigoValido()) {
            errores.append("El código debe tener entre 3 y 10 caracteres alfanuméricos. ");
        }

        // Validar consistencia de horas
        if (!asignatura.validarHorasConsistentes()) {
            errores.append("Las horas teóricas + prácticas deben igual créditos * 16. ");
        }

        // Validar auto-prerrequisito (siempre true para nuevas asignaturas)
        if (!asignatura.validarNoAutoPrerrequisito()) {
            errores.append("Una asignatura no puede ser prerrequisito de sí misma. ");
        }

        // Validar estado inactivo (siempre true para nuevas asignaturas activas)
        if (!asignatura.validarAsignaturaInactivaNoAsignable()) {
            errores.append("Asignatura inactiva no puede tener horarios. ");
        }

        if (errores.length() > 0) {
            String mensajeError = "Error creando asignatura " + asignatura.getCodigo() +
                    ": " + errores.toString();
            log.error(mensajeError);
            throw new IllegalArgumentException(mensajeError);
        }
    }

    /**
     * Crea una asignatura con descripción adicional
     */
    public Asignatura crearAsignaturaConDescripcion(String codigo, String nombre,
                                                    Integer creditos, Integer horasTeoricas,
                                                    Integer horasPracticas, String descripcion) {
        Asignatura asignatura = crearAsignatura(codigo, nombre, creditos,
                horasTeoricas, horasPracticas);
        asignatura.setDescripcion(descripcion);
        return asignatura;
    }

    /**
     * Crea una asignatura inactiva (para casos especiales)
     */
    public Asignatura crearAsignaturaInactiva(String codigo, String nombre,
                                              Integer creditos, Integer horasTeoricas,
                                              Integer horasPracticas) {
        Asignatura asignatura = crearAsignatura(codigo, nombre, creditos,
                horasTeoricas, horasPracticas);
        asignatura.setActiva(false);
        // Limpiar horarios para cumplir regla OCL
        asignatura.limpiarHorarios();
        return asignatura;
    }
}