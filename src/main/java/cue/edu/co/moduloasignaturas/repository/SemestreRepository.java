package cue.edu.co.moduloasignaturas.repository;

import cue.edu.co.moduloasignaturas.model.Semestre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SemestreRepository extends JpaRepository<Semestre, String> {

    // Buscar por número de semestre
    List<Semestre> findByNumero(Integer numero);

    // Buscar por plan de estudios
    List<Semestre> findByPlanEstudiosId(String planEstudiosId);

    // Buscar por número y plan de estudios
    Optional<Semestre> findByNumeroAndPlanEstudiosId(Integer numero, String planEstudiosId);

    // Existe por número y plan de estudios
    boolean existsByNumeroAndPlanEstudiosId(Integer numero, String planEstudiosId);

    // Buscar por nombre (contiene, ignore case)
    List<Semestre> findByNombreContainingIgnoreCase(String nombre);

    // Buscar por lista de asignaturas (asumiendo ManyToMany)
    List<Semestre> findByAsignaturasContaining(String asignaturaId);

    // Ordenar por número
    List<Semestre> findByPlanEstudiosIdOrderByNumero(String planEstudiosId);

    // Buscar por rango de números
    List<Semestre> findByNumeroBetween(Integer numeroMin, Integer numeroMax);

    // Contar por plan de estudios
    long countByPlanEstudiosId(String planEstudiosId);

    // Buscar por rango de créditos (esto no es soportado por Spring Data JPA directamente, lo debes manejar en el servicio usando streams)

    // Eliminar por plan de estudios
    void deleteByPlanEstudiosId(String planEstudiosId);
}