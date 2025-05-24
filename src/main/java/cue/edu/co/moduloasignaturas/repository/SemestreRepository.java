package cue.edu.co.moduloasignaturas.repository;

import cue.edu.co.moduloasignaturas.model.Semestre;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para operaciones CRUD de Semestre en MongoDB
 */
@Repository
public interface SemestreRepository extends MongoRepository<Semestre, String> {

    /**
     * Busca semestres por número
     */
    List<Semestre> findByNumero(Integer numero);

    /**
     * Busca semestres por plan de estudios
     */
    List<Semestre> findByPlanEstudiosId(String planEstudiosId);

    /**
     * Busca un semestre específico por plan y número
     */
    Optional<Semestre> findByPlanEstudiosIdAndNumero(String planEstudiosId, Integer numero);

    /**
     * Busca semestres por nombre (búsqueda parcial, case-insensitive)
     */
    @Query("{'nombre': {$regex: ?0, $options: 'i'}}")
    List<Semestre> findByNombreContainingIgnoreCase(String nombre);

    /**
     * Busca semestres ordenados por número
     */
    List<Semestre> findByPlanEstudiosIdOrderByNumero(String planEstudiosId);

    /**
     * Cuenta semestres por plan de estudios
     */
    long countByPlanEstudiosId(String planEstudiosId);

    /**
     * Busca semestres que tengan un rango específico de créditos
     */
    @Query("{ 'asignaturas': { $exists: true, $not: { $size: 0 } } }")
    List<Semestre> findSemestresConAsignaturas();

    /**
     * Busca el último semestre de un plan (mayor número)
     */
    Optional<Semestre> findTopByPlanEstudiosIdOrderByNumeroDesc(String planEstudiosId);

    /**
     * Verifica si existe un semestre con número específico en un plan
     */
    boolean existsByPlanEstudiosIdAndNumero(String planEstudiosId, Integer numero);
}