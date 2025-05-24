package cue.edu.co.moduloasignaturas.observer;

import cue.edu.co.moduloasignaturas.model.PlanEstudios;
import cue.edu.co.moduloasignaturas.model.Asignatura;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.ArrayList;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Clase Pensum que actúa como Sujeto en el patrón Observer
 * Notifica cambios a profesores y estudiantes
 */
@Component
public class Pensum implements Sujeto {

    private static final Logger log = LoggerFactory.getLogger(Pensum.class);

    // Lista thread-safe de observadores
    private final List<Observer> observadores = new CopyOnWriteArrayList<>();

    // Plan de estudios actual
    private PlanEstudios planActual;

    @Override
    public void agregarObservador(Observer observador) {
        if (observador != null && !observadores.contains(observador)) {
            observadores.add(observador);
            log.info("Observador agregado: {}", observador.getClass().getSimpleName());
        }
    }

    @Override
    public void eliminarObservador(Observer observador) {
        if (observadores.remove(observador)) {
            log.info("Observador eliminado: {}", observador.getClass().getSimpleName());
        }
    }

    @Override
    public void notificar(String mensaje, TipoCambio tipo, Object datos) {
        log.info("Notificando cambio: {} - {}", tipo, mensaje);

        observadores.forEach(observador -> {
            try {
                observador.actualizar(mensaje, tipo, datos);
            } catch (Exception e) {
                log.error("Error notificando a observador {}: {}",
                        observador.getClass().getSimpleName(), e.getMessage());
            }
        });
    }

    // Métodos específicos del dominio que desencadenan notificaciones

    /**
     * Establece el plan de estudios actual
     */
    public void establecerPlan(PlanEstudios plan) {
        this.planActual = plan;
        notificar("Nuevo plan de estudios establecido: " + plan.getNombre(),
                TipoCambio.PLAN_CREADO, plan);
    }

    /**
     * Agrega una asignatura al plan y notifica
     */
    public void agregarAsignatura(Asignatura asignatura, Integer numeroSemestre) {
        if (planActual == null) {
            throw new IllegalStateException("No hay un plan de estudios establecido");
        }

        // Buscar y agregar al semestre correspondiente
        planActual.getSemestres().stream()
                .filter(s -> numeroSemestre.equals(s.getNumero()))
                .findFirst()
                .ifPresentOrElse(
                        semestre -> {
                            semestre.agregarAsignatura(asignatura);
                            notificar("Asignatura agregada: " + asignatura.getNombre() +
                                            " al semestre " + numeroSemestre,
                                    TipoCambio.ASIGNATURA_AGREGADA, asignatura);
                        },
                        () -> {
                            throw new IllegalArgumentException("Semestre " + numeroSemestre + " no encontrado");
                        }
                );
    }

    /**
     * Elimina una asignatura y notifica
     */
    public void eliminarAsignatura(String codigoAsignatura, Integer numeroSemestre) {
        if (planActual == null) {
            throw new IllegalStateException("No hay un plan de estudios establecido");
        }

        planActual.getSemestres().stream()
                .filter(s -> numeroSemestre.equals(s.getNumero()))
                .findFirst()
                .ifPresent(semestre -> {
                    Asignatura asignaturaEliminada = semestre.getAsignaturas().stream()
                            .filter(a -> a.getCodigo().equals(codigoAsignatura))
                            .findFirst()
                            .orElse(null);

                    if (asignaturaEliminada != null) {
                        semestre.removerAsignatura(asignaturaEliminada);
                        notificar("Asignatura eliminada: " + asignaturaEliminada.getNombre(),
                                TipoCambio.ASIGNATURA_ELIMINADA, asignaturaEliminada);
                    }
                });
    }

    /**
     * Modifica una asignatura y notifica
     */
    public void modificarAsignatura(Asignatura asignatura) {
        notificar("Asignatura modificada: " + asignatura.getNombre(),
                TipoCambio.ASIGNATURA_MODIFICADA, asignatura);
    }

    /**
     * Cambia el estado de una asignatura y notifica
     */
    public void cambiarEstadoAsignatura(Asignatura asignatura, boolean activa) {
        asignatura.setActiva(activa);

        TipoCambio tipo = activa ? TipoCambio.ASIGNATURA_ACTIVADA : TipoCambio.ASIGNATURA_DESACTIVADA;
        String mensaje = "Asignatura " + asignatura.getNombre() +
                (activa ? " activada" : " desactivada");

        notificar(mensaje, tipo, asignatura);
    }

    /**
     * Agrega un prerrequisito y notifica
     */
    public void agregarPrerrequisito(Asignatura asignatura, Asignatura prerrequisito) {
        asignatura.agregarPrerrequisito(prerrequisito);
        notificar("Prerrequisito agregado: " + prerrequisito.getNombre() +
                        " para " + asignatura.getNombre(),
                TipoCambio.PRERREQUISITO_AGREGADO,
                new Object[]{asignatura, prerrequisito});
    }

    /**
     * Elimina un prerrequisito y notifica
     */
    public void eliminarPrerrequisito(Asignatura asignatura, Asignatura prerrequisito) {
        asignatura.removerPrerrequisito(prerrequisito);
        notificar("Prerrequisito eliminado: " + prerrequisito.getNombre() +
                        " de " + asignatura.getNombre(),
                TipoCambio.PRERREQUISITO_ELIMINADO,
                new Object[]{asignatura, prerrequisito});
    }

    /**
     * Obtiene estadísticas del pensum
     */
    public String obtenerEstadisticas() {
        if (planActual == null) {
            return "No hay plan de estudios establecido";
        }

        return String.format("Plan: %s%nObservadores: %d%nSemestres: %d%nCréditos totales: %d",
                planActual.getNombre(),
                observadores.size(),
                planActual.getSemestres().size(),
                planActual.calcularCreditos());
    }

    // Getters
    public PlanEstudios getPlanActual() {
        return planActual;
    }

    public int getNumeroObservadores() {
        return observadores.size();
    }

    public List<Observer> getObservadores() {
        return new ArrayList<>(observadores);
    }
}