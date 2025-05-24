package cue.edu.co.moduloasignaturas.model.state;

import cue.edu.co.moduloasignaturas.model.Asignatura;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Estado concreto: Asignatura Inactiva
 * Implementa el comportamiento cuando la asignatura está inactiva
 */
public class AsignaturaInactiva implements EstadoAsignatura {

    private static final Logger log = LoggerFactory.getLogger(AsignaturaInactiva.class);

    @Override
    public void accion(Asignatura asignatura) {
        log.info("Asignatura {} está inactiva y no disponible para inscripción",
                asignatura.getCodigo());

        // Cumple con la regla OCL: asignaturaInactivaNoAsignable
        if (asignatura.getHorarios() != null && !asignatura.getHorarios().isEmpty()) {
            log.warn("VIOLACIÓN OCL: Asignatura inactiva {} tiene horarios asignados",
                    asignatura.getCodigo());
            asignatura.limpiarHorarios();
            log.info("Horarios limpiados para asignatura inactiva {}",
                    asignatura.getCodigo());
        }
    }

    @Override
    public boolean esActiva() {
        return false;
    }

    @Override
    public String getNombreEstado() {
        return "INACTIVA";
    }

    @Override
    public String toString() {
        return "AsignaturaInactiva";
    }
}