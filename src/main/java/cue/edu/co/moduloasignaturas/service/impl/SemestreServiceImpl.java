package cue.edu.co.moduloasignaturas.service.impl;

import cue.edu.co.moduloasignaturas.model.Semestre;
import cue.edu.co.moduloasignaturas.model.Asignatura;
import cue.edu.co.moduloasignaturas.repository.SemestreRepository;
import cue.edu.co.moduloasignaturas.repository.AsignaturaRepository;
import cue.edu.co.moduloasignaturas.service.SemestreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementación del servicio para gestión de semestres
 */
@Service
public class SemestreServiceImpl implements SemestreService {

    @Autowired
    private SemestreRepository semestreRepository;

    @Autowired
    private AsignaturaRepository asignaturaRepository;

    @Override
    public List<Semestre> obtenerTodos() {
        return semestreRepository.findAll();
    }

    @Override
    public Optional<Semestre> obtenerPorId(String id) {
        return semestreRepository.findById(id);
    }

    @Override
    public List<Semestre> obtenerPorNumero(Integer numero) {
        return semestreRepository.findByNumero(numero);
    }

    @Override
    public List<Semestre> obtenerPorPlanEstudios(String planEstudiosId) {
        return semestreRepository.findByPlanEstudiosId(planEstudiosId);
    }

    @Override
    public Optional<Semestre> obtenerPorNumeroYPlan(Integer numero, String planEstudiosId) {
        return semestreRepository.findByNumeroAndPlanEstudiosId(numero, planEstudiosId);
    }

    @Override
    public Optional<Semestre> obtenerPorPlanYNumero(String planEstudiosId, Integer numero) {
        return semestreRepository.findByNumeroAndPlanEstudiosId(numero, planEstudiosId);
    }

    @Override
    public Semestre crear(Semestre semestre) {
        return guardar(semestre);
    }

    @Override
    public Semestre actualizar(String id, Semestre semestre) {
        if (!existePorId(id)) {
            throw new IllegalArgumentException("No existe un semestre con el ID: " + id);
        }
        semestre.setId(id);
        return guardar(semestre);
    }

    @Override
    public long contarPorPlanEstudios(String planEstudiosId) {
        return semestreRepository.countByPlanEstudiosId(planEstudiosId);
    }

    @Override
    public Optional<Semestre> obtenerUltimoSemestre(String planEstudiosId) {
        List<Semestre> semestres = obtenerOrdenadosPorNumero(planEstudiosId);
        return semestres.isEmpty() ? Optional.empty() : Optional.of(semestres.get(semestres.size() - 1));
    }

    @Override
    public List<Semestre> obtenerSemestresConAsignaturas(String planEstudiosId) {
        return obtenerPorPlanEstudios(planEstudiosId).stream()
                .filter(s -> s.getAsignaturas() != null && !s.getAsignaturas().isEmpty())
                .collect(Collectors.toList());
    }

    @Override
    public Semestre guardar(Semestre semestre) {
        // Verificar que no exista otro semestre con el mismo número en el mismo plan
        if (semestre.getId() == null &&
                existePorNumeroYPlan(semestre.getNumero(), semestre.getPlanEstudiosId())) {
            throw new IllegalArgumentException("Ya existe un semestre con el número " +
                    semestre.getNumero() + " en este plan de estudios");
        }

        return semestreRepository.save(semestre);
    }

    @Override
    public void eliminar(String id) {
        if (!existePorId(id)) {
            throw new IllegalArgumentException("No existe un semestre con el ID: " + id);
        }
        semestreRepository.deleteById(id);
    }

    @Override
    public boolean existePorId(String id) {
        return semestreRepository.existsById(id);
    }

    @Override
    public boolean existePorNumeroYPlan(Integer numero, String planEstudiosId) {
        return semestreRepository.existsByNumeroAndPlanEstudiosId(numero, planEstudiosId);
    }

    @Override
    public List<Semestre> buscarPorNombre(String nombre) {
        return semestreRepository.findByNombreContainingIgnoreCase(nombre);
    }

    @Override
    public Semestre agregarAsignatura(String semestreId, Asignatura asignatura) {
        Optional<Semestre> semestreOpt = obtenerPorId(semestreId);
        if (semestreOpt.isEmpty()) {
            throw new IllegalArgumentException("No existe un semestre con el ID: " + semestreId);
        }

        Semestre semestre = semestreOpt.get();

        // Verificar que la asignatura exista
        if (asignatura.getId() != null && !asignaturaRepository.existsById(asignatura.getId())) {
            throw new IllegalArgumentException("No existe una asignatura con el ID: " + asignatura.getId());
        }

        // Guardar la asignatura si es nueva
        if (asignatura.getId() == null) {
            asignatura = asignaturaRepository.save(asignatura);
        }

        semestre.agregarAsignatura(asignatura);

        // Validar que el semestre siga siendo válido después de agregar la asignatura
        // Nota: Necesitaríamos acceso al plan de estudios para validación completa
        if (!semestre.validarTieneAsignaturas()) {
            throw new IllegalArgumentException("Error en la validación del semestre");
        }

        return semestreRepository.save(semestre);
    }

    @Override
    public Semestre removerAsignatura(String semestreId, String asignaturaId) {
        Optional<Semestre> semestreOpt = obtenerPorId(semestreId);
        if (semestreOpt.isEmpty()) {
            throw new IllegalArgumentException("No existe un semestre con el ID: " + semestreId);
        }

        Semestre semestre = semestreOpt.get();

        // Buscar la asignatura a remover
        Optional<Asignatura> asignaturaOpt = semestre.getAsignaturas().stream()
                .filter(a -> a.getId().equals(asignaturaId))
                .findFirst();

        if (asignaturaOpt.isEmpty()) {
            throw new IllegalArgumentException("La asignatura no pertenece a este semestre");
        }

        semestre.removerAsignatura(asignaturaOpt.get());

        // Validar que el semestre siga siendo válido
        if (!semestre.validarTieneAsignaturas()) {
            throw new IllegalArgumentException("Un semestre debe tener al menos una asignatura");
        }

        return semestreRepository.save(semestre);
    }

    @Override
    public List<Asignatura> obtenerAsignaturas(String semestreId) {
        Optional<Semestre> semestreOpt = obtenerPorId(semestreId);
        if (semestreOpt.isEmpty()) {
            throw new IllegalArgumentException("No existe un semestre con el ID: " + semestreId);
        }

        return semestreOpt.get().obtenerAsignaturas();
    }

    @Override
    public int calcularCreditos(String semestreId) {
        Optional<Semestre> semestreOpt = obtenerPorId(semestreId);
        if (semestreOpt.isEmpty()) {
            throw new IllegalArgumentException("No existe un semestre con el ID: " + semestreId);
        }

        return semestreOpt.get().calcularCreditos();
    }

    @Override
    public boolean validarSemestre(Semestre semestre, Integer duracionMaximaPlan) {
        return semestre.validarTodasLasReglas(duracionMaximaPlan);
    }

    @Override
    public List<Semestre> buscarPorAsignatura(String asignaturaId) {
        return semestreRepository.findByAsignaturasContaining(asignaturaId);
    }

    @Override
    public List<Semestre> obtenerOrdenadosPorNumero(String planEstudiosId) {
        return semestreRepository.findByPlanEstudiosIdOrderByNumero(planEstudiosId);
    }

    @Override
    public List<Semestre> obtenerPorRangoNumeros(Integer numeroMin, Integer numeroMax) {
        return semestreRepository.findByNumeroBetween(numeroMin, numeroMax);
    }

    @Override
    public long contarPorPlan(String planEstudiosId) {
        return semestreRepository.countByPlanEstudiosId(planEstudiosId);
    }

    @Override
    public List<Semestre> obtenerPorRangoCreditos(Integer creditosMin, Integer creditosMax) {
        return obtenerTodos().stream()
                .filter(semestre -> {
                    int creditos = semestre.calcularCreditos();
                    return creditos >= creditosMin && creditos <= creditosMax;
                })
                .collect(Collectors.toList());
    }

    @Override
    public EstadisticasSemestres obtenerEstadisticas() {
        List<Semestre> todosSemestres = obtenerTodos();

        if (todosSemestres.isEmpty()) {
            return new EstadisticasSemestres(0, 0.0, 0.0, 0, 0);
        }

        long totalSemestres = todosSemestres.size();

        double promedioCreditos = todosSemestres.stream()
                .mapToInt(Semestre::calcularCreditos)
                .average()
                .orElse(0.0);

        double promedioAsignaturas = todosSemestres.stream()
                .mapToInt(s -> s.getAsignaturas().size())
                .average()
                .orElse(0.0);

        int creditosMinimos = todosSemestres.stream()
                .mapToInt(Semestre::calcularCreditos)
                .min()
                .orElse(0);

        int creditosMaximos = todosSemestres.stream()
                .mapToInt(Semestre::calcularCreditos)
                .max()
                .orElse(0);

        return new EstadisticasSemestres(totalSemestres, promedioCreditos, promedioAsignaturas,
                creditosMinimos, creditosMaximos);
    }

    @Override
    public boolean puedeEliminar(String semestreId) {
        Optional<Semestre> semestreOpt = obtenerPorId(semestreId);
        if (semestreOpt.isEmpty()) {
            return false;
        }

        // Un semestre puede eliminarse si no tiene dependencias críticas
        // Aquí puedes agregar lógica específica según tus reglas de negocio
        return true;
    }

    @Override
    public void eliminarPorPlan(String planEstudiosId) {
        semestreRepository.deleteByPlanEstudiosId(planEstudiosId);
    }
}