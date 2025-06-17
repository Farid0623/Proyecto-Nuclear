package cue.edu.co.moduloasignaturas.controller;

import cue.edu.co.moduloasignaturas.model.Asignatura;
import cue.edu.co.moduloasignaturas.service.AsignaturaService;
import cue.edu.co.moduloasignaturas.service.ServicioValidacion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

/**
 * Controlador REST para gestión de asignaturas con Spring Security
 */
@RestController
@RequestMapping("/api/asignaturas")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AsignaturaController {

    @Autowired
    private AsignaturaService asignaturaService;

    @Autowired
    private ServicioValidacion servicioValidacion;

    /**
     * Obtiene todas las asignaturas
     * Acceso: Profesores, Coordinadores y Administradores
     */
    @GetMapping
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Asignatura>> obtenerTodas() {
        List<Asignatura> asignaturas = asignaturaService.obtenerTodas();
        return ResponseEntity.ok(asignaturas);
    }

    /**
     * Obtiene una asignatura por ID
     * Acceso: Profesores, Coordinadores y Administradores
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<Asignatura> obtenerPorId(@PathVariable String id) {
        Optional<Asignatura> asignatura = asignaturaService.obtenerPorId(id);
        return asignatura.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Obtiene una asignatura por código
     * Acceso: Profesores, Coordinadores y Administradores
     */
    @GetMapping("/codigo/{codigo}")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<Asignatura> obtenerPorCodigo(@PathVariable String codigo) {
        Optional<Asignatura> asignatura = asignaturaService.obtenerPorCodigo(codigo);
        return asignatura.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Crea una nueva asignatura
     * Acceso: Solo Coordinadores y Administradores
     */
    @PostMapping
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> crear(@Valid @RequestBody Asignatura asignatura) {
        try {
            // Validar usando Chain of Responsibility
            ServicioValidacion.ResultadoValidacion resultado =
                    servicioValidacion.validarAsignatura(asignatura);

            if (!resultado.esValido()) {
                return ResponseEntity.badRequest().body(resultado.getErrores());
            }

            Asignatura nuevaAsignatura = asignaturaService.guardar(asignatura);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaAsignatura);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creando asignatura: " + e.getMessage());
        }
    }

    /**
     * Actualiza una asignatura existente
     * Acceso: Solo Coordinadores y Administradores
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> actualizar(@PathVariable String id,
                                        @Valid @RequestBody Asignatura asignatura) {
        try {
            if (!asignaturaService.existePorId(id)) {
                return ResponseEntity.notFound().build();
            }

            // Validar usando Chain of Responsibility
            ServicioValidacion.ResultadoValidacion resultado =
                    servicioValidacion.validarAsignatura(asignatura);

            if (!resultado.esValido()) {
                return ResponseEntity.badRequest().body(resultado.getErrores());
            }

            asignatura.setId(id);
            Asignatura asignaturaActualizada = asignaturaService.guardar(asignatura);
            return ResponseEntity.ok(asignaturaActualizada);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error actualizando asignatura: " + e.getMessage());
        }
    }

    /**
     * Elimina una asignatura
     * Acceso: Solo Administradores
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        if (!asignaturaService.existePorId(id)) {
            return ResponseEntity.notFound().build();
        }

        asignaturaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Busca asignaturas por nombre
     * Acceso: Profesores, Coordinadores y Administradores
     */
    @GetMapping("/buscar")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Asignatura>> buscarPorNombre(@RequestParam String nombre) {
        List<Asignatura> asignaturas = asignaturaService.buscarPorNombre(nombre);
        return ResponseEntity.ok(asignaturas);
    }

    /**
     * Obtiene asignaturas activas
     * Acceso: Profesores, Coordinadores y Administradores
     */
    @GetMapping("/activas")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Asignatura>> obtenerActivas() {
        List<Asignatura> asignaturas = asignaturaService.obtenerActivas();
        return ResponseEntity.ok(asignaturas);
    }

    /**
     * Obtiene asignaturas por créditos
     * Acceso: Profesores, Coordinadores y Administradores
     */
    @GetMapping("/creditos/{creditos}")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Asignatura>> obtenerPorCreditos(@PathVariable Integer creditos) {
        List<Asignatura> asignaturas = asignaturaService.obtenerPorCreditos(creditos);
        return ResponseEntity.ok(asignaturas);
    }

    /**
     * Valida datos de una asignatura sin crearla
     * Acceso: Coordinadores y Administradores
     */
    @PostMapping("/validar")
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> validarDatos(@RequestBody ValidacionRequest request) {
        ServicioValidacion.ResultadoValidacion resultado =
                servicioValidacion.validarDatosAsignatura(
                        request.getCodigo(),
                        request.getNombre(),
                        request.getCreditos(),
                        request.getHorasTeoricas(),
                        request.getHorasPracticas()
                );

        if (resultado.esValido()) {
            return ResponseEntity.ok("Datos válidos");
        } else {
            return ResponseEntity.badRequest().body(resultado.getErrores());
        }
    }

    /**
     * Cambia el estado de una asignatura (activa/inactiva)
     * Acceso: Solo Coordinadores y Administradores
     */
    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<Asignatura> cambiarEstado(@PathVariable String id,
                                                    @RequestParam boolean activa) {
        try {
            Asignatura asignatura = asignaturaService.cambiarEstado(id, activa);
            return ResponseEntity.ok(asignatura);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Agrega prerrequisito a una asignatura
     * Acceso: Solo Coordinadores y Administradores
     */
    @PostMapping("/{id}/prerrequisitos/{prereqId}")
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<Asignatura> agregarPrerrequisito(@PathVariable String id,
                                                           @PathVariable String prereqId) {
        try {
            Asignatura asignatura = asignaturaService.agregarPrerrequisito(id, prereqId);
            return ResponseEntity.ok(asignatura);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * Remueve prerrequisito de una asignatura
     * Acceso: Solo Coordinadores y Administradores
     */
    @DeleteMapping("/{id}/prerrequisitos/{prereqId}")
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<Asignatura> removerPrerrequisito(@PathVariable String id,
                                                           @PathVariable String prereqId) {
        try {
            Asignatura asignatura = asignaturaService.removerPrerrequisito(id, prereqId);
            return ResponseEntity.ok(asignatura);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * Obtiene estadísticas de asignaturas
     * Acceso: Solo Coordinadores y Administradores
     */
    @GetMapping("/estadisticas")
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<AsignaturaService.EstadisticasAsignaturas> obtenerEstadisticas() {
        AsignaturaService.EstadisticasAsignaturas estadisticas = asignaturaService.obtenerEstadisticas();
        return ResponseEntity.ok(estadisticas);
    }

    /**
     * Endpoint especial para alumnos - solo pueden ver asignaturas activas básicas
     */
    @GetMapping("/publicas")
    @PreAuthorize("hasRole('ALUMNO') or hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<AsignaturaBasica>> obtenerAsignaturasPublicas() {
        List<Asignatura> asignaturas = asignaturaService.obtenerActivas();
        List<AsignaturaBasica> asignaturasBasicas = asignaturas.stream()
                .map(a -> new AsignaturaBasica(a.getId(), a.getCodigo(), a.getNombre(), a.calcularCreditos()))
                .toList();
        return ResponseEntity.ok(asignaturasBasicas);
    }

    // Clase interna para validación
    public static class ValidacionRequest {
        private String codigo;
        private String nombre;
        private Integer creditos;
        private Integer horasTeoricas;
        private Integer horasPracticas;

        // Getters y Setters
        public String getCodigo() { return codigo; }
        public void setCodigo(String codigo) { this.codigo = codigo; }

        public String getNombre() { return nombre; }
        public void setNombre(String nombre) { this.nombre = nombre; }

        public Integer getCreditos() { return creditos; }
        public void setCreditos(Integer creditos) { this.creditos = creditos; }

        public Integer getHorasTeoricas() { return horasTeoricas; }
        public void setHorasTeoricas(Integer horasTeoricas) { this.horasTeoricas = horasTeoricas; }

        public Integer getHorasPracticas() { return horasPracticas; }
        public void setHorasPracticas(Integer horasPracticas) { this.horasPracticas = horasPracticas; }
    }

    // Clase para información básica de asignatura (para alumnos)
    public static class AsignaturaBasica {
        private String id;
        private String codigo;
        private String nombre;
        private Integer creditos;

        public AsignaturaBasica(String id, String codigo, String nombre, Integer creditos) {
            this.id = id;
            this.codigo = codigo;
            this.nombre = nombre;
            this.creditos = creditos;
        }

        // Getters
        public String getId() { return id; }
        public String getCodigo() { return codigo; }
        public String getNombre() { return nombre; }
        public Integer getCreditos() { return creditos; }
    }
}