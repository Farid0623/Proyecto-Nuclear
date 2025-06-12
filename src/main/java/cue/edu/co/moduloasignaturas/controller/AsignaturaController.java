package cue.edu.co.moduloasignaturas.controller;

import cue.edu.co.moduloasignaturas.model.Asignatura;
import cue.edu.co.moduloasignaturas.service.AsignaturaService;
import cue.edu.co.moduloasignaturas.service.ServicioValidacion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

/**
 * Controlador REST para gestión de asignaturas
 */
@RestController
@RequestMapping("/api/asignaturas")
@CrossOrigin(origins = "*")
public class AsignaturaController {

    @Autowired
    private AsignaturaService asignaturaService;

    @Autowired
    private ServicioValidacion servicioValidacion;

    /**
     * Obtiene todas las asignaturas
     */
    @GetMapping
    public ResponseEntity<List<Asignatura>> obtenerTodas() {
        List<Asignatura> asignaturas = asignaturaService.obtenerTodas();
        return ResponseEntity.ok(asignaturas);
    }

    /**
     * Obtiene una asignatura por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Asignatura> obtenerPorId(@PathVariable String id) {
        Optional<Asignatura> asignatura = asignaturaService.obtenerPorId(id);
        return asignatura.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Obtiene una asignatura por código
     */
    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<Asignatura> obtenerPorCodigo(@PathVariable String codigo) {
        Optional<Asignatura> asignatura = asignaturaService.obtenerPorCodigo(codigo);
        return asignatura.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Crea una nueva asignatura
     */
    @PostMapping
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
     */
    @PutMapping("/{id}")
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
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        if (!asignaturaService.existePorId(id)) {
            return ResponseEntity.notFound().build();
        }

        asignaturaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Busca asignaturas por nombre
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<Asignatura>> buscarPorNombre(@RequestParam String nombre) {
        List<Asignatura> asignaturas = asignaturaService.buscarPorNombre(nombre);
        return ResponseEntity.ok(asignaturas);
    }

    /**
     * Obtiene asignaturas activas
     */
    @GetMapping("/activas")
    public ResponseEntity<List<Asignatura>> obtenerActivas() {
        List<Asignatura> asignaturas = asignaturaService.obtenerActivas();
        return ResponseEntity.ok(asignaturas);
    }

    /**
     * Obtiene asignaturas por créditos
     */
    @GetMapping("/creditos/{creditos}")
    public ResponseEntity<List<Asignatura>> obtenerPorCreditos(@PathVariable Integer creditos) {
        List<Asignatura> asignaturas = asignaturaService.obtenerPorCreditos(creditos);
        return ResponseEntity.ok(asignaturas);
    }

    /**
     * Valida datos de una asignatura sin crearla
     */
    @PostMapping("/validar")
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
     */
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Asignatura> cambiarEstado(@PathVariable String id,
                                                    @RequestParam boolean activa) {
        try {
            Asignatura asignatura = asignaturaService.cambiarEstado(id, activa);
            return ResponseEntity.ok(asignatura);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
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
}