package cue.edu.co.moduloasignaturas.service;

import cue.edu.co.moduloasignaturas.model.PlanEstudios;
import cue.edu.co.moduloasignaturas.model.Semestre;
import cue.edu.co.moduloasignaturas.model.Asignatura;

import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Servicio para gestión de planes de estudios
 */
public interface PlanEstudiosService {

    /**
     * Obtiene todos los planes de estudios
     */
    List<PlanEstudios> obtenerTodos();

    /**
     * Obtiene un plan de estudios por ID
     */
    Optional<PlanEstudios> obtenerPorId(String id);

    /**
     * Obtiene un plan de estudios por código
     */
    Optional<PlanEstudios> obtenerPorCodigo(String codigo);

    /**
     * Guarda un plan de estudios (crear o actualizar)
     */
    PlanEstudios guardar(PlanEstudios planEstudios);

    /**
     * Elimina un plan de estudios por ID
     */
    void eliminar(String id);

    /**
     * Verifica si existe un plan con el ID dado
     */
    boolean existePorId(String id);

    /**
     * Verifica si existe un plan con el código dado
     */
    boolean existePorCodigo(String codigo);

    /**
     * Obtiene planes activos
     */
    List<PlanEstudios> obtenerActivos();

    /**
     * Busca planes por nombre (búsqueda parcial)
     */
    List<PlanEstudios> buscarPorNombre(String nombre);

    /**
     * Obtiene planes por facultad
     */
    List<PlanEstudios> obtenerPorFacultad(String facultad);

    /**
     * Obtiene planes por programa
     */
    List<PlanEstudios> obtenerPorPrograma(String programa);

    /**
     * Obtiene planes por duración de semestres
     */
    List<PlanEstudios> obtenerPorDuracion(Integer duracion);

    /**
     * Cambia el estado de un plan (activo/inactivo)
     */
    PlanEstudios cambiarEstado(String id, boolean activo);

    /**
     * Agrega un semestre al plan de estudios
     */
    PlanEstudios agregarSemestre(String planId, Semestre semestre);

    /**
     * Remueve un semestre del plan de estudios
     */
    PlanEstudios removerSemestre(String planId, String semestreId);

    /**
     * Obtiene asignaturas de un semestre específico
     */
    Set<Asignatura> obtenerAsignaturasPorSemestre(String planId, Integer numeroSemestre);

    /**
     * Obtiene todas las asignaturas del plan
     */
    List<Asignatura> obtenerTodasLasAsignaturas(String planId);

    /**
     * Calcula créditos totales del plan
     */
    int calcularCreditosTotales(String planId);

    /**
     * Valida un plan de estudios
     */
    boolean validarPlan(PlanEstudios plan);

    /**
     * Obtiene estadísticas de planes de estudios
     */
    EstadisticasPlanes obtenerEstadisticas();

    /**
     * Busca una asignatura específica en el plan
     */
    Optional<Asignatura> buscarAsignaturaEnPlan(String planId, String codigoAsignatura);

    /**
     * Verifica prerrequisitos para una asignatura
     */
    boolean verificarPrerequisitos(String planId, String asignaturaId, List<String> asignaturasAprobadas);

    /**
     * Clase para estadísticas de planes
     */
    class EstadisticasPlanes {
        private long totalPlanes;
        private long planesActivos;
        private long planesInactivos;
        private double promedioCreditos;
        private double promedioDuracion;
        private long planesPorFacultad;

        // Constructores
        public EstadisticasPlanes() {}

        public EstadisticasPlanes(long totalPlanes, long planesActivos, long planesInactivos,
                                  double promedioCreditos, double promedioDuracion) {
            this.totalPlanes = totalPlanes;
            this.planesActivos = planesActivos;
            this.planesInactivos = planesInactivos;
            this.promedioCreditos = promedioCreditos;
            this.promedioDuracion = promedioDuracion;
        }

        // Getters y Setters
        public long getTotalPlanes() { return totalPlanes; }
        public void setTotalPlanes(long totalPlanes) { this.totalPlanes = totalPlanes; }

        public long getPlanesActivos() { return planesActivos; }
        public void setPlanesActivos(long planesActivos) { this.planesActivos = planesActivos; }

        public long getPlanesInactivos() { return planesInactivos; }
        public void setPlanesInactivos(long planesInactivos) { this.planesInactivos = planesInactivos; }

        public double getPromedioCreditos() { return promedioCreditos; }
        public void setPromedioCreditos(double promedioCreditos) { this.promedioCreditos = promedioCreditos; }

        public double getPromedioDuracion() { return promedioDuracion; }
        public void setPromedioDuracion(double promedioDuracion) { this.promedioDuracion = promedioDuracion; }

        public long getPlanesPorFacultad() { return planesPorFacultad; }
        public void setPlanesPorFacultad(long planesPorFacultad) { this.planesPorFacultad = planesPorFacultad; }
    }
}