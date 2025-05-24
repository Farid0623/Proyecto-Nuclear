package cue.edu.co.moduloasignaturas.service;

import cue.edu.co.moduloasignaturas.model.Asignatura;
import cue.edu.co.moduloasignaturas.repository.AsignaturaRepository;
import cue.edu.co.moduloasignaturas.factory.AsignaturaFactory;
import cue.edu.co.moduloasignaturas.observer.Pensum;
import cue.edu.co.moduloasignaturas.observer.TipoCambio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

/**
 * Servicio para gestión de asignaturas
 * Implementa la lógica de negocio y coordina con repositorios y patrones
 */
@Service
public class AsignaturaService {

    private static final Logger log = LoggerFactory.getLogger(AsignaturaService.class);

    @Autowired
    private AsignaturaRepository asignaturaRepository;

    @Autowired
    private AsignaturaFactory asignaturaFactory;

    @Autowired
    private Pensum pensum;

    /**
     * Obtiene todas las asignaturas
     */
    public List<Asignatura> obtenerTodas() {
        log.info("Obteniendo todas las asignaturas");
        return asignaturaRepository.findAll();
    }

    /**
     * Obtiene una asignatura por ID
     */
    public Optional<Asignatura> obtenerPorId(String id) {
        log.debug("Obteniendo asignatura por ID: {}", id);
        return asignaturaRepository.findById(id);
    }

    /**
     * Obtiene una asignatura por código
     */
    public Optional<Asignatura> obtenerPorCodigo(String codigo) {
        log.debug("Obteniendo asignatura por código: {}", codigo);
        return asignaturaRepository.findByCodigo(codigo);
    }

    /**
     * Verifica si existe una asignatura por ID
     */
    public boolean existePorId(String id) {
        return asignaturaRepository.existsById(id);
    }

    /**
     * Verifica si existe una asignatura por código
     */
    public boolean existePorCodigo(String codigo) {
        return asignaturaRepository.existsByCodigo(codigo);
    }

    /**
     * Crea una nueva asignatura usando el Factory
     */
    public Asignatura crearAsignatura(String codigo, String nombre, Integer creditos,
                                      Integer horasTeoricas, Integer horasPracticas) {
        log.info("Creando nueva asignatura: {}", codigo);

        // Verificar que no exista el código
        if (existePorCodigo(codigo)) {
            throw new IllegalArgumentException("Ya existe una asignatura con código: " + codigo);
        }

        // Usar Factory para crear
        Asignatura asignatura = asignaturaFactory.crearAsignatura(
                codigo, nombre, creditos, horasTeoricas, horasPracticas);

        // Guardar en base de datos
        Asignatura asignaturaGuardada = asignaturaRepository.save(asignatura);

        // Notificar a observadores
        pensum.notificar("Nueva asignatura creada: " + codigo,
                TipoCambio.ASIGNATURA_AGREGADA, asignaturaGuardada);

        log.info("Asignatura creada exitosamente: {}", codigo);
        return asignaturaGuardada;
    }

    /**
     * Guarda o actualiza una asignatura
     */
    public Asignatura guardar(Asignatura asignatura) {
        log.info("Guardando asignatura: {}", asignatura.getCodigo());

        boolean esNueva = asignatura.getId() == null;

        // Validar reglas OCL antes de guardar
        if (!asignatura.validarTodasLasReglas()) {
            throw new IllegalArgumentException("La asignatura no cumple las reglas OCL");
        }

        Asignatura asignaturaGuardada = asignaturaRepository.save(asignatura);

        // Notificar a observadores
        TipoCambio tipoCambio = esNueva ? TipoCambio.ASIGNATURA_AGREGADA : TipoCambio.ASIGNATURA_MODIFICADA;
        String mensaje = esNueva ? "Asignatura agregada: " : "Asignatura modificada: ";

        pensum.notificar(mensaje + asignatura.getCodigo(), tipoCambio, asignaturaGuardada);

        return asignaturaGuardada;
    }

    /**
     * Elimina una asignatura
     */
    public void eliminar(String id) {
        log.info("Eliminando asignatura con ID: {}", id);

        Optional<Asignatura> asignaturaOpt = obtenerPorId(id);
        if (asignaturaOpt.isPresent()) {
            Asignatura asignatura = asignaturaOpt.get();

            // Verificar que no tenga dependencias (prerrequisitos en otras asignaturas)
            verificarDependencias(asignatura);

            asignaturaRepository.deleteById(id);

            // Notificar a observadores
            pensum.notificar("Asignatura eliminada: " + asignatura.getCodigo(),
                    TipoCambio.ASIGNATURA_ELIMINADA, asignatura);

            log.info("Asignatura eliminada: {}", asignatura.getCodigo());
        }
    }

    /**
     * Busca asignaturas por nombre
     */
    public List<Asignatura> buscarPorNombre(String nombre) {
        log.debug("Buscando asignaturas por nombre: {}", nombre);
        return asignaturaRepository.findByNombreContainingIgnoreCase(nombre);
    }

    /**
     * Obtiene asignaturas activas
     */
    public List<Asignatura> obtenerActivas() {
        log.debug("Obteniendo asignaturas activas");
        return asignaturaRepository.findByActivaTrue();
    }

    /**
     * Obtiene asignaturas por créditos
     */
    public List<Asignatura> obtenerPorCreditos(Integer creditos) {
        log.debug("Obteniendo asignaturas con {} créditos", creditos);
        return asignaturaRepository.findByCreditos(creditos);
    }

    /**
     * Cambia el estado de una asignatura (activa/inactiva)
     */
    public Asignatura cambiarEstado(String id, boolean activa) {
        log.info("Cambiando estado de asignatura {} a {}", id, activa);

        Asignatura asignatura = obtenerPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("Asignatura no encontrada: " + id));

        asignatura.setActiva(activa);

        // Si se desactiva, limpiar horarios (regla OCL)
        if (!activa) {
            asignatura.limpiarHorarios();
        }

        Asignatura asignaturaActualizada = asignaturaRepository.save(asignatura);

        // Notificar a observadores
        TipoCambio tipoCambio = activa ? TipoCambio.ASIGNATURA_ACTIVADA : TipoCambio.ASIGNATURA_DESACTIVADA;
        String mensaje = "Asignatura " + (activa ? "activada" : "desactivada") + ": " + asignatura.getCodigo();

        pensum.notificar(mensaje, tipoCambio, asignaturaActualizada);

        return asignaturaActualizada;
    }

    /**
     * Agrega un prerrequisito a una asignatura
     */
    public Asignatura agregarPrerrequisito(String idAsignatura, String idPrerrequisito) {
        log.info("Agregando prerrequisito {} a asignatura {}", idPrerrequisito, idAsignatura);

        Asignatura asignatura = obtenerPorId(idAsignatura)
                .orElseThrow(() -> new IllegalArgumentException("Asignatura no encontrada: " + idAsignatura));

        Asignatura prerrequisito = obtenerPorId(idPrerrequisito)
                .orElseThrow(() -> new IllegalArgumentException("Prerrequisito no encontrado: " + idPrerrequisito));

        asignatura.agregarPrerrequisito(prerrequisito);

        // Validar reglas OCL después de agregar
        if (!asignatura.validarTodasLasReglas()) {
            throw new IllegalArgumentException("Agregar este prerrequisito viola las reglas OCL");
        }

        Asignatura asignaturaActualizada = asignaturaRepository.save(asignatura);

        // Notificar a observadores
        pensum.notificar("Prerrequisito agregado: " + prerrequisito.getCodigo() +
                        " para " + asignatura.getCodigo(),
                TipoCambio.PRERREQUISITO_AGREGADO,
                new Object[]{asignatura, prerrequisito});

        return asignaturaActualizada;
    }

    /**
     * Remueve un prerrequisito de una asignatura
     */
    public Asignatura removerPrerrequisito(String idAsignatura, String idPrerrequisito) {
        log.info("Removiendo prerrequisito {} de asignatura {}", idPrerrequisito, idAsignatura);

        Asignatura asignatura = obtenerPorId(idAsignatura)
                .orElseThrow(() -> new IllegalArgumentException("Asignatura no encontrada: " + idAsignatura));

        Asignatura prerrequisito = obtenerPorId(idPrerrequisito)
                .orElseThrow(() -> new IllegalArgumentException("Prerrequisito no encontrado: " + idPrerrequisito));

        asignatura.removerPrerrequisito(prerrequisito);

        Asignatura asignaturaActualizada = asignaturaRepository.save(asignatura);

        // Notificar a observadores
        pensum.notificar("Prerrequisito removido: " + prerrequisito.getCodigo() +
                        " de " + asignatura.getCodigo(),
                TipoCambio.PRERREQUISITO_ELIMINADO,
                new Object[]{asignatura, prerrequisito});

        return asignaturaActualizada;
    }

    /**
     * Obtiene estadísticas de asignaturas
     */
    public EstadisticasAsignaturas obtenerEstadisticas() {
        log.info("Generando estadísticas de asignaturas");

        long totalAsignaturas = asignaturaRepository.count();
        long asignaturasActivas = asignaturaRepository.countAsignaturasActivas();
        long asignaturasInactivas = totalAsignaturas - asignaturasActivas;

        List<Asignatura> todasLasAsignaturas = obtenerTodas();
        double promedioCreditosPorAsignatura = todasLasAsignaturas.stream()
                .mapToInt(Asignatura::calcularCreditos)
                .average()
                .orElse(0.0);

        return new EstadisticasAsignaturas(
                totalAsignaturas,
                asignaturasActivas,
                asignaturasInactivas,
                promedioCreditosPorAsignatura
        );
    }

    /**
     * Verifica dependencias antes de eliminar
     */
    private void verificarDependencias(Asignatura asignatura) {
        // Aquí verificaríamos si la asignatura es prerrequisito de otras
        // Por simplicidad, solo logueamos
        log.debug("Verificando dependencias para asignatura: {}", asignatura.getCodigo());
    }

    /**
     * Clase para estadísticas
     */
    public static class EstadisticasAsignaturas {
        private final long totalAsignaturas;
        private final long asignaturasActivas;
        private final long asignaturasInactivas;
        private final double promedioCreditosPorAsignatura;

        public EstadisticasAsignaturas(long totalAsignaturas, long asignaturasActivas,
                                       long asignaturasInactivas, double promedioCreditosPorAsignatura) {
            this.totalAsignaturas = totalAsignaturas;
            this.asignaturasActivas = asignaturasActivas;
            this.asignaturasInactivas = asignaturasInactivas;
            this.promedioCreditosPorAsignatura = promedioCreditosPorAsignatura;
        }

        // Getters
        public long getTotalAsignaturas() { return totalAsignaturas; }
        public long getAsignaturasActivas() { return asignaturasActivas; }
        public long getAsignaturasInactivas() { return asignaturasInactivas; }
        public double getPromedioCreditosPorAsignatura() { return promedioCreditosPorAsignatura; }
    }
}