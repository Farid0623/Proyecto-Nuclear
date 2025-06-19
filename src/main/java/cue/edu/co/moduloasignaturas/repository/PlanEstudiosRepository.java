package cue.edu.co.moduloasignaturas.repository;

import cue.edu.co.moduloasignaturas.model.PlanEstudios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlanEstudiosRepository extends JpaRepository<PlanEstudios, String> {
    Optional<PlanEstudios> findByCodigo(String codigo);
    List<PlanEstudios> findByActivoTrue();
    List<PlanEstudios> findByPrograma(String programa);
    boolean existsByCodigo(String codigo);
}