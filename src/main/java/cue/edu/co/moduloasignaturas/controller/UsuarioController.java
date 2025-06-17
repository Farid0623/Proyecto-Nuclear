package cue.edu.co.moduloasignaturas.controller;

import cue.edu.co.moduloasignaturas.model.Usuario;
import cue.edu.co.moduloasignaturas.model.Role;
import cue.edu.co.moduloasignaturas.repository.UsuarioRepository;
import cue.edu.co.moduloasignaturas.dto.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder encoder;

    // Solo administradores pueden ver todos los usuarios
    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Usuario>> getAllUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return ResponseEntity.ok(usuarios);
    }

    // Solo administradores pueden buscar usuarios por rol
    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Usuario>> getUsuariosByRole(@PathVariable Role role) {
        List<Usuario> usuarios = usuarioRepository.findByRole(role);
        return ResponseEntity.ok(usuarios);
    }

    // Solo administradores pueden obtener usuario por ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable String id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        return usuario.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Solo administradores pueden actualizar usuarios
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> updateUsuario(@PathVariable String id, @Valid @RequestBody Usuario usuario) {
        Optional<Usuario> usuarioExistente = usuarioRepository.findById(id);

        if (usuarioExistente.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Usuario no encontrado!"));
        }

        Usuario usuarioActualizar = usuarioExistente.get();
        usuarioActualizar.setNombre(usuario.getNombre());
        usuarioActualizar.setApellido(usuario.getApellido());
        usuarioActualizar.setEmail(usuario.getEmail());
        usuarioActualizar.setRole(usuario.getRole());
        usuarioActualizar.setEnabled(usuario.isEnabled());

        // Mantener el ID original
        usuarioActualizar.setId(id);

        usuarioRepository.save(usuarioActualizar);

        return ResponseEntity.ok(new MessageResponse("Usuario actualizado exitosamente!"));
    }

    // Solo administradores pueden eliminar usuarios
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> deleteUsuario(@PathVariable String id) {
        if (!usuarioRepository.existsById(id)) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Usuario no encontrado!"));
        }

        usuarioRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Usuario eliminado exitosamente!"));
    }

    // Cualquier usuario autenticado puede ver su propio perfil
    @GetMapping("/perfil")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Usuario> getPerfilUsuario() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<Usuario> usuario = usuarioRepository.findByUsername(username);

        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Cualquier usuario autenticado puede actualizar su propio perfil
    @PutMapping("/perfil")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updatePerfilUsuario(@Valid @RequestBody PerfilUpdateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<Usuario> usuarioExistente = usuarioRepository.findByUsername(username);

        if (usuarioExistente.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Usuario no encontrado!"));
        }

        Usuario usuarioActualizar = usuarioExistente.get();
        usuarioActualizar.setNombre(request.getNombre());
        usuarioActualizar.setApellido(request.getApellido());
        usuarioActualizar.setEmail(request.getEmail());

        // No permitir cambio de rol desde el perfil
        // usuarioActualizar.setRole(usuario.getRole());

        usuarioRepository.save(usuarioActualizar);

        return ResponseEntity.ok(new MessageResponse("Perfil actualizado exitosamente!"));
    }

    // Cualquier usuario autenticado puede cambiar su contraseña
    @PostMapping("/cambiar-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> cambiarPassword(@Valid @RequestBody PasswordChangeRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<Usuario> usuarioExistente = usuarioRepository.findByUsername(username);

        if (usuarioExistente.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Usuario no encontrado!"));
        }

        Usuario usuario = usuarioExistente.get();

        // Verificar contraseña actual
        if (!encoder.matches(request.getPasswordActual(), usuario.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Contraseña actual incorrecta!"));
        }

        // Actualizar contraseña
        usuario.setPassword(encoder.encode(request.getPasswordNueva()));
        usuarioRepository.save(usuario);

        return ResponseEntity.ok(new MessageResponse("Contraseña cambiada exitosamente!"));
    }

    // Verificar si existe usuario por username
    @GetMapping("/exists/username/{username}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Boolean> existsByUsername(@PathVariable String username) {
        boolean exists = usuarioRepository.existsByUsername(username);
        return ResponseEntity.ok(exists);
    }

    // Verificar si existe usuario por email
    @GetMapping("/exists/email/{email}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Boolean> existsByEmail(@PathVariable String email) {
        boolean exists = usuarioRepository.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }

    // Obtener usuarios activos
    @GetMapping("/activos")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Usuario>> getUsuariosActivos() {
        List<Usuario> usuarios = usuarioRepository.findByEnabledTrue();
        return ResponseEntity.ok(usuarios);
    }

    // Activar/Desactivar usuario
    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> cambiarEstadoUsuario(@PathVariable String id, @RequestParam boolean enabled) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Usuario no encontrado!"));
        }

        Usuario usuario = usuarioOpt.get();
        usuario.setEnabled(enabled);
        usuarioRepository.save(usuario);

        String mensaje = enabled ? "Usuario activado exitosamente!" : "Usuario desactivado exitosamente!";
        return ResponseEntity.ok(new MessageResponse(mensaje));
    }

    // Buscar usuarios por nombre o apellido
    @GetMapping("/buscar")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Usuario>> buscarUsuarios(@RequestParam String termino) {
        // Implementar búsqueda si tu repositorio la tiene
        // Por ahora retornamos lista vacía
        return ResponseEntity.ok(List.of());
    }

    // DTO para actualización de perfil
    public static class PerfilUpdateRequest {
        private String nombre;
        private String apellido;
        private String email;

        public PerfilUpdateRequest() {}

        public String getNombre() {
            return nombre;
        }

        public void setNombre(String nombre) {
            this.nombre = nombre;
        }

        public String getApellido() {
            return apellido;
        }

        public void setApellido(String apellido) {
            this.apellido = apellido;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }

    // DTO para cambio de contraseña
    public static class PasswordChangeRequest {
        private String passwordActual;
        private String passwordNueva;

        public PasswordChangeRequest() {}

        public String getPasswordActual() {
            return passwordActual;
        }

        public void setPasswordActual(String passwordActual) {
            this.passwordActual = passwordActual;
        }

        public String getPasswordNueva() {
            return passwordNueva;
        }

        public void setPasswordNueva(String passwordNueva) {
            this.passwordNueva = passwordNueva;
        }
    }
}