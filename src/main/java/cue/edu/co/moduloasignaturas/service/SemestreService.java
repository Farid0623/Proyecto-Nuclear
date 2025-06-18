package cue.edu.co.moduloasignaturas.service;

import cue.edu.co.moduloasignaturas.model.Semestre;
import cue.edu.co.moduloasignaturas.model.Asignatura;

import java.util.List;
import java.util.Optional;

/**
 * Servicio pavara gestión de semestres
 */
public interface SemestreService {

    /**
     * Obtiene todos los semestres
     */
    List<Semestre> obtenerTodos();

    /**
     * Obtiene un semestre por ID
     */
    Optional<Semestre> obtenerPorId(String id);

    /**
     * Obtiene semestres por número
     */
    List<Semestre> obtenerPorNumero(Integer numero);

    /**
     * Obtiene semestres por plan de estudios
     */
    List<Semestre> obtenerPorPlanEstudios(String planEstudiosId);

    /**
     * Obtiene un semestre específico por número y plan
     */
    Optional<Semestre> obtenerPorNumeroYPlan(Integer numero, String planEstudiosId);

    /**
     * Obtiene semestre por plan y número
     */
    Optional<Semestre> obtenerPorPlanYNumero(String planEstudiosId, Integer numero);

    /**
     * Crea un nuevo semestre
     */
    Semestre crear(Semestre semestre);

    /**
     * Actualiza un semestre existente
     */
    Semestre actualizar(String id, Semestre semestre);

    /**
     * Cuenta semestres por plan de estudios
     */
    long contarPorPlanEstudios(String planEstudiosId);

    /**
     * Obtiene último semestre de un plan
     */
    Optional<Semestre> obtenerUltimoSemestre(String planEstudiosId);

    /**
     * Obtiene semestres con asignaturas específicas
     */
    List<Semestre> obtenerSemestresConAsignaturas(String planEstudiosId);

    /**
     * Guarda un semestre (crear o actualizar)
     */
    Semestre guardar(Semestre semestre);

    /**
     * Elimina un semestre por ID
     */
    void eliminar(String id);

    /**
     * Verifica si existe un semestre con el ID dado
     */
    boolean existePorId(String id);

    /**
     * Verifica si existe un semestre con número específico en un plan
     */
    boolean existePorNumeroYPlan(Integer numero, String planEstudiosId);

    /**
     * Busca semestres por nombre
     */
    List<Semestre> buscarPorNombre(String nombre);

    /**
     * Agrega una asignatura al semestre
     */
    Semestre agregarAsignatura(String semestreId, Asignatura asignatura);

    /**
     * Remueve una asignatura del semestre
     */
    Semestre removerAsignatura(String semestreId, String asignaturaId);

    /**
     * Obtiene asignaturas de un semestre
     */
    List<Asignatura> obtenerAsignaturas(String semestreId);

    /**
     * Calcula créditos totales de un semestre
     */
    int calcularCreditos(String semestreId);

    /**
     * Valida un semestre según las reglas OCL
     */
    boolean validarSemestre(Semestre semestre, Integer duracionMaximaPlan);

    /**
     * Busca semestres que contengan una asignatura específica
     */
    List<Semestre> buscarPorAsignatura(String asignaturaId);

    /**
     * Obtiene semestres ordenados por número para un plan
     */
    List<Semestre> obtenerOrdenadosPorNumero(String planEstudiosId);

    /**
     * Busca semestres por rango de números
     */
    List<Semestre> obtenerPorRangoNumeros(Integer numeroMin, Integer numeroMax);

    /**
     * Cuenta semestres por plan de estudios
     */
    long contarPorPlan(String planEstudiosId);

    /**
     * Obtiene estadísticas de semestres
     */
    EstadisticasSemestres obtenerEstadisticas();

    /**
     * Verifica si un semestre puede ser eliminado
     */
    boolean puedeEliminar(String semestreId);

    /**
     * Busca semestres por rango de créditos
     */
    List<Semestre> obtenerPorRangoCreditos(Integer creditosMin, Integer creditosMax);

    /**
     * Elimina todos los semestres de un plan de estudios
     */
    void eliminarPorPlan(String planEstudiosId);

    /**
     * Clase para estadísticas de semestres
     */
    class EstadisticasSemestres {
        private long totalSemestres;
        private double promedioCreditos;
        private double promedioAsignaturas;
        private int creditosMinimos;
        private int creditosMaximos;

        // Constructores
        public EstadisticasSemestres() {}

        public EstadisticasSemestres(long totalSemestres, double promedioCreditos,
                                     double promedioAsignaturas, int creditosMinimos, int creditosMaximos) {
            this.totalSemestres = totalSemestres;
            this.promedioCreditos = promedioCreditos;
            this.promedioAsignaturas = promedioAsignaturas;
            this.creditosMinimos = creditosMinimos;
            this.creditosMaximos = creditosMaximos;
        }

        // Getters y Setters
        public long getTotalSemestres() { return totalSemestres; }
        public void setTotalSemestres(long totalSemestres) { this.totalSemestres = totalSemestres; }

        public double getPromedioCreditos() { return promedioCreditos; }
        public void setPromedioCreditos(double promedioCreditos) { this.promedioCreditos = promedioCreditos; }

        public double getPromedioAsignaturas() { return promedioAsignaturas; }
        public void setPromedioAsignaturas(double promedioAsignaturas) { this.promedioAsignaturas = promedioAsignaturas; }

        public int getCreditosMinimos() { return creditosMinimos; }
        public void setCreditosMinimos(int creditosMinimos) { this.creditosMinimos = creditosMinimos; }

        public int getCreditosMaximos() { return creditosMaximos; }
        public void setCreditosMaximos(int creditosMaximos) { this.creditosMaximos = creditosMaximos; }
    }
}