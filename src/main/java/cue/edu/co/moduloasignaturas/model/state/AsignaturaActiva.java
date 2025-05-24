package cue.edu.co.moduloasignaturas.model.state;

import cue.edu.co.moduloasignaturas.model.Asignatura;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Estado concreto: Asignatura Activa
 * Implementa el comportamiento cuando la asignatura está activa
 */
public class AsignaturaActiva implements EstadoAsignatura {

    private static final Logger log = LoggerFactory.getLogger(AsignaturaActiva.class);

    @Override
    public void accion(Asignatura asignatura) {
        log.info("Asignatura {} está activa y disponible para inscripción",
                asignatura.getCodigo());
        // La asignatura puede ser asignada a horarios y tomada por estudiantes
    }

    @Override
    public boolean esActiva() {
        return true;
    }

    @Override
    public String getNombreEstado() {
        return "ACTIVA";
    }

    @Override
    public String toString() {
        return "AsignaturaActiva";
    }
}