package cue.edu.co.moduloasignaturas.repository;

import cue.edu.co.moduloasignaturas.model.PlanEstudios;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para operaciones CRUD de PlanEstudios en MongoDB
 */
@Repository
public interface PlanEstudiosRepository extends MongoRepository<PlanEstudios, String> {

    /**
     * Busca un plan de estudios por su código único
     */
    Optional<PlanEstudios> findByCodigo(String codigo);

    /**
     * Verifica si existe un plan con el código dado
     */
    boolean existsByCodigo(String codigo);

    /**
     * Busca planes por nombre (búsqueda parcial, case-insensitive)
     */
    @Query("{'nombre': {$regex: ?0, $options: 'i'}}")
    List<PlanEstudios> findByNombreContainingIgnoreCase(String nombre);

    /**
     * Busca planes por facultad
     */
    List<PlanEstudios> findByFacultad(String facultad);

    /**
     * Busca planes por programa
     */
    List<PlanEstudios> findByPrograma(String programa);

    /**
     * Busca planes activos
     */
    List<PlanEstudios> findByActivoTrue();

    /**
     * Busca planes por duración en semestres
     */
    List<PlanEstudios> findByDuracionSemestres(Integer duracion);

    /**
     * Busca planes por rango de duración
     */
    @Query("{'duracionSemestres': {$gte: ?0, $lte: ?1}}")
    List<PlanEstudios> findByDuracionSemestresBetween(Integer duracionMin, Integer duracionMax);

    /**
     * Busca planes por facultad y programa
     */
    List<PlanEstudios> findByFacultadAndPrograma(String facultad, String programa);

    /**
     * Cuenta planes activos
     */
    @Query(value = "{'activo': true}", count = true)
    long countPlanesActivos();

    /**
     * Obtiene todos los planes ordenados por nombre
     */
    List<PlanEstudios> findAllByOrderByNombre();

    /**
     * Busca planes que contengan texto en nombre o descripción
     */
    @Query("{ $or: [ " +
            "{'nombre': {$regex: ?0, $options: 'i'}}, " +
            "{'descripcion': {$regex: ?0, $options: 'i'}} " +
            "] }")
    List<PlanEstudios> buscarPorTexto(String texto);
}