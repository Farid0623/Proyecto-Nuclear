package cue.edu.co.moduloasignaturas.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/all")
    public String allAccess() {
        return "Contenido público.";
    }

    @GetMapping("/alumno")
    @PreAuthorize("hasRole('ALUMNO')")
    public String alumnoAccess() {
        return "Panel de Alumno.";
    }

    @GetMapping("/profesor")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public String profesorAccess() {
        return "Panel de Profesor.";
    }

    @GetMapping("/coordinador")
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public String coordinadorAccess() {
        return "Panel de Coordinador.";
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public String adminAccess() {
        return "Panel de Administrador.";
    }
}