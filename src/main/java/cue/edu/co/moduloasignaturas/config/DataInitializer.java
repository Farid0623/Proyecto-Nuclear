package cue.edu.co.moduloasignaturas.config;

import cue.edu.co.moduloasignaturas.model.Usuario;
import cue.edu.co.moduloasignaturas.model.Role;
import cue.edu.co.moduloasignaturas.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Crear usuario administrador por defecto si no existe
        if (!usuarioRepository.existsByUsername("admin")) {
            Usuario admin = new Usuario();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@universidad.edu.co");
            admin.setNombre("Administrador");
            admin.setApellido("Sistema");
            admin.setRole(Role.ADMINISTRADOR);
            admin.setEnabled(true);

            usuarioRepository.save(admin);
            System.out.println("Usuario administrador creado: admin/admin123");
        }

        // Crear usuario coordinador por defecto si no existe
        if (!usuarioRepository.existsByUsername("coordinador")) {
            Usuario coordinador = new Usuario();
            coordinador.setUsername("coordinador");
            coordinador.setPassword(passwordEncoder.encode("coord123"));
            coordinador.setEmail("coordinador@universidad.edu.co");
            coordinador.setNombre("Juan");
            coordinador.setApellido("Coordinador");
            coordinador.setRole(Role.COORDINADOR);
            coordinador.setEnabled(true);

            usuarioRepository.save(coordinador);
            System.out.println("Usuario coordinador creado: coordinador/coord123");
        }

        // Crear usuario profesor por defecto si no existe
        if (!usuarioRepository.existsByUsername("profesor")) {
            Usuario profesor = new Usuario();
            profesor.setUsername("profesor");
            profesor.setPassword(passwordEncoder.encode("prof123"));
            profesor.setEmail("profesor@universidad.edu.co");
            profesor.setNombre("María");
            profesor.setApellido("Docente");
            profesor.setRole(Role.PROFESOR);
            profesor.setEnabled(true);

            usuarioRepository.save(profesor);
            System.out.println("Usuario profesor creado: profesor/prof123");
        }

        // Crear usuario alumno por defecto si no existe
        if (!usuarioRepository.existsByUsername("alumno")) {
            Usuario alumno = new Usuario();
            alumno.setUsername("alumno");
            alumno.setPassword(passwordEncoder.encode("alum123"));
            alumno.setEmail("alumno@universidad.edu.co");
            alumno.setNombre("Carlos");
            alumno.setApellido("Estudiante");
            alumno.setRole(Role.ALUMNO);
            alumno.setEnabled(true);

            usuarioRepository.save(alumno);
            System.out.println("Usuario alumno creado: alumno/alum123");
        }
    }
}