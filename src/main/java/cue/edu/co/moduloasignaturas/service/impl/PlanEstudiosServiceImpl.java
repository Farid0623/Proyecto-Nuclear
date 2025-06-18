package cue.edu.co.moduloasignaturas.service.impl;

import cue.edu.co.moduloasignaturas.model.PlanEstudios;
import cue.edu.co.moduloasignaturas.model.Semestre;
import cue.edu.co.moduloasignaturas.model.Asignatura;
import cue.edu.co.moduloasignaturas.repository.PlanEstudiosRepository;
import cue.edu.co.moduloasignaturas.repository.SemestreRepository;
import cue.edu.co.moduloasignaturas.service.PlanEstudiosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Implementación del servicio para gestión de planes de estudios
 */
@Service
public class PlanEstudiosServiceImpl implements PlanEstudiosService {

    @Autowired
    private PlanEstudiosRepository planEstudiosRepository;

    @Autowired
    private SemestreRepository semestreRepository;

    @Override
    public List<PlanEstudios> obtenerTodos() {
        return planEstudiosRepository.findAll();
    }

    @Override
    public Optional<PlanEstudios> obtenerPorId(String id) {
        return planEstudiosRepository.findById(id);
    }

    @Override
    public Optional<PlanEstudios> obtenerPorCodigo(String codigo) {
        return planEstudiosRepository.findByCodigo(codigo);
    }

    @Override
    public PlanEstudios guardar(PlanEstudios planEstudios) {
        // Validar reglas OCL antes de guardar
        if (!planEstudios.validarTodasLasReglas()) {
            throw new IllegalArgumentException("El plan de estudios no cumple las reglas de validación");
        }

        // Verificar unicidad del código
        if (planEstudios.getId() == null && existePorCodigo(planEstudios.getCodigo())) {
            throw new IllegalArgumentException("Ya existe un plan con el código: " + planEstudios.getCodigo());
        }

        return planEstudiosRepository.save(planEstudios);
    }

    @Override
    public void eliminar(String id) {
        if (!existePorId(id)) {
            throw new IllegalArgumentException("No existe un plan con el ID: " + id);
        }
        planEstudiosRepository.deleteById(id);
    }

    @Override
    public boolean existePorId(String id) {
        return planEstudiosRepository.existsById(id);
    }

    @Override
    public boolean existePorCodigo(String codigo) {
        return planEstudiosRepository.existsByCodigo(codigo);
    }

    @Override
    public List<PlanEstudios> obtenerActivos() {
        return planEstudiosRepository.findByActivoTrue();
    }

    @Override
    public List<PlanEstudios> buscarPorNombre(String nombre) {
        return planEstudiosRepository.findByNombreContainingIgnoreCase(nombre);
    }

    @Override
    public List<PlanEstudios> obtenerPorFacultad(String facultad) {
        return planEstudiosRepository.findByFacultad(facultad);
    }

    @Override
    public List<PlanEstudios> obtenerPorPrograma(String programa) {
        return planEstudiosRepository.findByPrograma(programa);
    }

    @Override
    public List<PlanEstudios> obtenerPorDuracion(Integer duracion) {
        return planEstudiosRepository.findByDuracionSemestres(duracion);
    }

    @Override
    public PlanEstudios cambiarEstado(String id, boolean activo) {
        Optional<PlanEstudios> planOpt = obtenerPorId(id);
        if (planOpt.isEmpty()) {
            throw new IllegalArgumentException("No existe un plan con el ID: " + id);
        }

        PlanEstudios plan = planOpt.get();
        plan.setActivo(activo);
        return planEstudiosRepository.save(plan);
    }

    @Override
    public PlanEstudios agregarSemestre(String planId, Semestre semestre) {
        Optional<PlanEstudios> planOpt = obtenerPorId(planId);
        if (planOpt.isEmpty()) {
            throw new IllegalArgumentException("No existe un plan con el ID: " + planId);
        }

        PlanEstudios plan = planOpt.get();

        // Crear una variable final para usar en el lambda
        final Semestre semestreParaComparar = semestre;

        // Verificar que el número de semestre no esté duplicado
        if (semestreParaComparar.getNumero() != null) {
            boolean numeroExiste = plan.getSemestres().stream()
                    .anyMatch(s -> s.getNumero() != null && s.getNumero().equals(semestreParaComparar.getNumero()));

            if (numeroExiste) {
                throw new IllegalArgumentException("Ya existe un semestre con el número: " + semestreParaComparar.getNumero());
            }
        }

        // Guardar el semestre primero si es necesario
        if (semestre.getId() == null) {
            semestre.setPlanEstudiosId(planId);
            semestre = semestreRepository.save(semestre);
        }

        plan.agregarSemestre(semestre);

        // Validar que el plan siga siendo válido
        /*
        if (!plan.validarTodasLasReglas()) {
            throw new IllegalArgumentException("Agregar este semestre viola las reglas del plan de estudios");
        }

         */

        return planEstudiosRepository.save(plan);
    }

    @Override
    public PlanEstudios removerSemestre(String planId, String semestreId) {
        Optional<PlanEstudios> planOpt = obtenerPorId(planId);
        if (planOpt.isEmpty()) {
            throw new IllegalArgumentException("No existe un plan con el ID: " + planId);
        }

        PlanEstudios plan = planOpt.get();

        // Buscar y remover el semestre
        Optional<Semestre> semestreOpt = plan.getSemestres().stream()
                .filter(s -> s.getId() != null && s.getId().equals(semestreId))
                .findFirst();

        if (semestreOpt.isEmpty()) {
            throw new IllegalArgumentException("No existe un semestre con el ID: " + semestreId + " en este plan");
        }

        plan.removerSemestre(semestreOpt.get());

        // Validar que el plan siga siendo válido (con validaciones condicionales)
        if (!plan.validarTodasLasReglas()) {
            throw new IllegalArgumentException("Remover este semestre viola las reglas del plan de estudios");
        }

        return planEstudiosRepository.save(plan);
    }

    @Override
    public Set<Asignatura> obtenerAsignaturasPorSemestre(String planId, Integer numeroSemestre) {
        Optional<PlanEstudios> planOpt = obtenerPorId(planId);
        if (planOpt.isEmpty()) {
            throw new IllegalArgumentException("No existe un plan con el ID: " + planId);
        }

        return planOpt.get().obtenerAsignaturasPorSemestre(numeroSemestre);
    }

    @Override
    public List<Asignatura> obtenerTodasLasAsignaturas(String planId) {
        Optional<PlanEstudios> planOpt = obtenerPorId(planId);
        if (planOpt.isEmpty()) {
            throw new IllegalArgumentException("No existe un plan con el ID: " + planId);
        }

        return planOpt.get().obtenerTodasLasAsignaturas();
    }

    @Override
    public int calcularCreditosTotales(String planId) {
        Optional<PlanEstudios> planOpt = obtenerPorId(planId);
        if (planOpt.isEmpty()) {
            throw new IllegalArgumentException("No existe un plan con el ID: " + planId);
        }

        return planOpt.get().calcularCreditos();
    }

    @Override
    public boolean validarPlan(PlanEstudios plan) {
        return plan.validarTodasLasReglas();
    }

    @Override
    public EstadisticasPlanes obtenerEstadisticas() {
        List<PlanEstudios> todosLosPlanes = obtenerTodos();

        long totalPlanes = todosLosPlanes.size();
        long planesActivos = todosLosPlanes.stream()
                .filter(p -> p.getActivo() != null && p.getActivo())
                .count();
        long planesInactivos = totalPlanes - planesActivos;

        double promedioCreditos = todosLosPlanes.stream()
                .mapToInt(PlanEstudios::calcularCreditos)
                .average()
                .orElse(0.0);

        double promedioDuracion = todosLosPlanes.stream()
                .filter(p -> p.getDuracionSemestres() != null)
                .mapToInt(PlanEstudios::getDuracionSemestres)
                .average()
                .orElse(0.0);

        return new EstadisticasPlanes(totalPlanes, planesActivos, planesInactivos,
                promedioCreditos, promedioDuracion);
    }

    @Override
    public Optional<Asignatura> buscarAsignaturaEnPlan(String planId, String codigoAsignatura) {
        Optional<PlanEstudios> planOpt = obtenerPorId(planId);
        if (planOpt.isEmpty()) {
            return Optional.empty();
        }

        Asignatura asignatura = planOpt.get().buscarAsignaturaPorCodigo(codigoAsignatura);
        return Optional.ofNullable(asignatura);
    }

    @Override
    public boolean verificarPrerequisitos(String planId, String asignaturaId, List<String> asignaturasAprobadas) {
        Optional<PlanEstudios> planOpt = obtenerPorId(planId);
        if (planOpt.isEmpty()) {
            throw new IllegalArgumentException("No existe un plan con el ID: " + planId);
        }

        PlanEstudios plan = planOpt.get();

        // Buscar la asignatura en el plan
        Optional<Asignatura> asignaturaOpt = plan.obtenerTodasLasAsignaturas().stream()
                .filter(a -> a.getId().equals(asignaturaId))
                .findFirst();

        if (asignaturaOpt.isEmpty()) {
            throw new IllegalArgumentException("La asignatura no pertenece a este plan de estudios");
        }

        Asignatura asignatura = asignaturaOpt.get();
        List<Asignatura> prerrequisitos = asignatura.obtenerPrerrequisitos();

        // Si no tiene prerrequisitos, puede tomarla
        if (prerrequisitos.isEmpty()) {
            return true;
        }

        // Verificar que todas las asignaturas prerrequisito estén aprobadas
        return prerrequisitos.stream()
                .allMatch(prereq -> asignaturasAprobadas.contains(prereq.getId()));
    }
}