package cue.edu.co.moduloasignaturas.repository;

import cue.edu.co.moduloasignaturas.model.Usuario;
import cue.edu.co.moduloasignaturas.model.Role;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UsuarioRepository extends MongoRepository<Usuario, String> {

    Optional<Usuario> findByUsername(String username);

    Optional<Usuario> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    List<Usuario> findByRole(Role role);

    List<Usuario> findByEnabledTrue();
}