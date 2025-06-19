package cue.edu.co.moduloasignaturas.repository;

import cue.edu.co.moduloasignaturas.model.Asignatura;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface AsignaturaRepository extends MongoRepository<Asignatura, String> {
    List<Asignatura> findBySemestre(int semestre);
    Optional<Asignatura> findByNombre(String nombre);
    List<Asignatura> findByCreditos(int creditos);
    List<Asignatura> findByActivaTrue();
    Optional<Asignatura> findByCodigo(String codigo);
}