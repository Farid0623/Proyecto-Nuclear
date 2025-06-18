package cue.edu.co.moduloasignaturas.repository;

import cue.edu.co.moduloasignaturas.model.Semestre;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository para gestión de semestres en MongoDB
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
     * Busca un semestre específico por número y plan de estudios
     */
    Optional<Semestre> findByNumeroAndPlanEstudiosId(Integer numero, String planEstudiosId);

    /**
     * Busca semestres por nombre (búsqueda parcial, case-insensitive)
     */
    @Query("{'nombre': {$regex: ?0, $options: 'i'}}")
    List<Semestre> findByNombreContainingIgnoreCase(String nombre);

    /**
     * Busca semestres que contengan una asignatura específica
     */
    @Query("{'asignaturas.$id': ?0}")
    List<Semestre> findByAsignaturasContaining(String asignaturaId);

    /**
     * Obtiene semestres ordenados por número
     */
    List<Semestre> findByPlanEstudiosIdOrderByNumero(String planEstudiosId);

    /**
     * Busca semestres por rango de números
     */
    List<Semestre> findByNumeroBetween(Integer numeroMin, Integer numeroMax);

    /**
     * Verifica si existe un semestre con el número dado en un plan específico
     */
    boolean existsByNumeroAndPlanEstudiosId(Integer numero, String planEstudiosId);

    /**
     * Cuenta semestres por plan de estudios
     */
    long countByPlanEstudiosId(String planEstudiosId);

    /**
     * Obtiene semestres con créditos en un rango específico
     * Nota: Esta consulta se implementa mejor en el Service usando lógica de aplicación
     */
    // Removido - se implementa en el service

    /**
     * Elimina todos los semestres de un plan de estudios
     */
    void deleteByPlanEstudiosId(String planEstudiosId);
}