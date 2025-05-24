package cue.edu.co.moduloasignaturas.repository;

import cue.edu.co.moduloasignaturas.model.Asignatura;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para operaciones CRUD de Asignatura en MongoDB
 */
@Repository
public interface AsignaturaRepository extends MongoRepository<Asignatura, String> {

    /**
     * Busca una asignatura por su código único
     */
    Optional<Asignatura> findByCodigo(String codigo);

    /**
     * Verifica si existe una asignatura con el código dado
     */
    boolean existsByCodigo(String codigo);

    /**
     * Busca asignaturas por nombre (búsqueda parcial, case-insensitive)
     */
    @Query("{'nombre': {$regex: ?0, $options: 'i'}}")
    List<Asignatura> findByNombreContainingIgnoreCase(String nombre);

    /**
     * Busca asignaturas por número de créditos
     */
    List<Asignatura> findByCreditos(Integer creditos);

    /**
     * Busca asignaturas activas
     */
    List<Asignatura> findByActivaTrue();

    /**
     * Busca asignaturas inactivas
     */
    List<Asignatura> findByActivaFalse();

    /**
     * Busca asignaturas por rango de créditos
     */
    @Query("{'creditos': {$gte: ?0, $lte: ?1}}")
    List<Asignatura> findByCreditosBetween(Integer creditosMin, Integer creditosMax);

    /**
     * Busca asignaturas por semestre
     */
    List<Asignatura> findByNumeroSemestre(Integer numeroSemestre);

    /**
     * Busca asignaturas que contengan texto en nombre o descripción
     */
    @Query("{ $or: [ " +
            "{'nombre': {$regex: ?0, $options: 'i'}}, " +
            "{'descripcion': {$regex: ?0, $options: 'i'}} " +
            "] }")
    List<Asignatura> buscarPorTexto(String texto);

    /**
     * Cuenta asignaturas activas
     */
    @Query(value = "{'activa': true}", count = true)
    long countAsignaturasActivas();

    /**
     * Obtiene asignaturas ordenadas por código
     */
    List<Asignatura> findAllByOrderByCodigo();

    /**
     * Busca asignaturas sin prerrequisitos
     */
    @Query("{ $or: [ " +
            "{'prerrequisitos': {$exists: false}}, " +
            "{'prerrequisitos': {$size: 0}} " +
            "] }")
    List<Asignatura> findAsignaturasSinPrerrequisitos();
}