package cue.edu.co.moduloasignaturas.repository;

import cue.edu.co.moduloasignaturas.model.PlanEstudios;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository para gestión de planes de estudios en MongoDB
 */
@Repository
public interface PlanEstudiosRepository extends MongoRepository<PlanEstudios, String> {

    /**
     * Busca un plan de estudios por código
     */
    Optional<PlanEstudios> findByCodigo(String codigo);

    /**
     * Busca planes de estudios por nombre (búsqueda parcial, case-insensitive)
     */
    @Query("{'nombre': {$regex: ?0, $options: 'i'}}")
    List<PlanEstudios> findByNombreContainingIgnoreCase(String nombre);

    /**
     * Obtiene planes activos
     */
    List<PlanEstudios> findByActivoTrue();

    /**
     * Obtiene planes por facultad
     */
    List<PlanEstudios> findByFacultad(String facultad);

    /**
     * Obtiene planes por programa
     */
    List<PlanEstudios> findByPrograma(String programa);

    /**
     * Obtiene planes por duración de semestres
     */
    List<PlanEstudios> findByDuracionSemestres(Integer duracion);

    /**
     * Verifica si existe un plan con el código dado
     */
    boolean existsByCodigo(String codigo);

    /**
     * Verifica si existe un plan con el nombre dado
     */
    boolean existsByNombre(String nombre);

    /**
     * Obtiene planes por facultad y que estén activos
     */
    List<PlanEstudios> findByFacultadAndActivoTrue(String facultad);

    /**
     * Busca planes por rango de duración de semestres
     */
    List<PlanEstudios> findByDuracionSemestresBetween(Integer minDuracion, Integer maxDuracion);

    /**
     * Cuenta planes activos por facultad
     */
    @Query(value = "{'facultad': ?0, 'activo': true}", count = true)
    long countByFacultadAndActivoTrue(String facultad);

    /**
     * Obtiene estadísticas básicas de planes
     */
    @Query(value = "{}", fields = "{'codigo': 1, 'nombre': 1, 'duracionSemestres': 1, 'activo': 1}")
    List<PlanEstudios> findAllBasicInfo();
}