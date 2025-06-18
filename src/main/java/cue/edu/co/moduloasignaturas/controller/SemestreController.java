package cue.edu.co.moduloasignaturas.controller;

import cue.edu.co.moduloasignaturas.model.Semestre;
import cue.edu.co.moduloasignaturas.model.Asignatura;
import cue.edu.co.moduloasignaturas.service.SemestreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

/**
 * Controlador REST para gestión de semestres
 */
@RestController
@RequestMapping("/api/semestres")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SemestreController {

    @Autowired
    private SemestreService semestreService;

    /**
     * Obtiene todos los semestres
     */
    @GetMapping
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Semestre>> obtenerTodos() {
        List<Semestre> semestres = semestreService.obtenerTodos();
        return ResponseEntity.ok(semestres);
    }

    /**
     * Obtiene un semestre por ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<Semestre> obtenerPorId(@PathVariable String id) {
        Optional<Semestre> semestre = semestreService.obtenerPorId(id);
        return semestre.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Obtiene semestres por plan de estudios
     */
    @GetMapping("/plan/{planId}")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Semestre>> obtenerPorPlanEstudios(@PathVariable String planId) {
        List<Semestre> semestres = semestreService.obtenerPorPlanEstudios(planId);
        return ResponseEntity.ok(semestres);
    }

    /**
     * Obtiene un semestre por número y plan
     */
    @GetMapping("/plan/{planId}/numero/{numero}")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<Semestre> obtenerPorPlanYNumero(@PathVariable String planId,
                                                          @PathVariable Integer numero) {
        Optional<Semestre> semestre = semestreService.obtenerPorPlanYNumero(planId, numero);
        return semestre.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Crea un nuevo semestre
     */
    @PostMapping
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> crear(@Valid @RequestBody Semestre semestre) {
        try {
            Semestre nuevoSemestre = semestreService.crear(semestre);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoSemestre);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creando semestre: " + e.getMessage());
        }
    }

    /**
     * Actualiza un semestre existente
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> actualizar(@PathVariable String id,
                                        @Valid @RequestBody Semestre semestre) {
        try {
            Semestre semestreActualizado = semestreService.actualizar(id, semestre);
            return ResponseEntity.ok(semestreActualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error actualizando semestre: " + e.getMessage());
        }
    }

    /**
     * Elimina un semestre
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> eliminar(@PathVariable String id) {
        try {
            if (!semestreService.existePorId(id)) {
                return ResponseEntity.notFound().build();
            }
            semestreService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error eliminando semestre: " + e.getMessage());
        }
    }

    /**
     * Busca semestres por nombre
     */
    @GetMapping("/buscar")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Semestre>> buscarPorNombre(@RequestParam String nombre) {
        List<Semestre> semestres = semestreService.buscarPorNombre(nombre);
        return ResponseEntity.ok(semestres);
    }

    /**
     * Obtiene semestres por número
     */
    @GetMapping("/numero/{numero}")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Semestre>> obtenerPorNumero(@PathVariable Integer numero) {
        List<Semestre> semestres = semestreService.obtenerPorNumero(numero);
        return ResponseEntity.ok(semestres);
    }

    /**
     * Agrega una asignatura al semestre
     */
    @PostMapping("/{id}/asignaturas")
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> agregarAsignatura(@PathVariable String id,
                                               @RequestBody Asignatura asignatura) {
        try {
            Semestre semestre = semestreService.agregarAsignatura(id, asignatura);
            return ResponseEntity.ok(semestre);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error agregando asignatura: " + e.getMessage());
        }
    }

    /**
     * Remueve una asignatura del semestre
     */
    @DeleteMapping("/{semestreId}/asignaturas/{asignaturaId}")
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> removerAsignatura(@PathVariable String semestreId,
                                               @PathVariable String asignaturaId) {
        try {
            Semestre semestre = semestreService.removerAsignatura(semestreId, asignaturaId);
            return ResponseEntity.ok(semestre);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error removiendo asignatura: " + e.getMessage());
        }
    }

    /**
     * Obtiene asignaturas de un semestre
     */
    @GetMapping("/{id}/asignaturas")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Asignatura>> obtenerAsignaturas(@PathVariable String id) {
        try {
            List<Asignatura> asignaturas = semestreService.obtenerAsignaturas(id);
            return ResponseEntity.ok(asignaturas);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Calcula créditos totales de un semestre
     */
    @GetMapping("/{id}/creditos")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> calcularCreditos(@PathVariable String id) {
        try {
            int creditos = semestreService.calcularCreditos(id);
            return ResponseEntity.ok(new CreditosResponse(creditos));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error calculando créditos: " + e.getMessage());
        }
    }

    /**
     * Obtiene semestres ordenados por número para un plan
     */
    @GetMapping("/plan/{planId}/ordenados")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Semestre>> obtenerOrdenadosPorNumero(@PathVariable String planId) {
        List<Semestre> semestres = semestreService.obtenerOrdenadosPorNumero(planId);
        return ResponseEntity.ok(semestres);
    }

    /**
     * Cuenta semestres por plan de estudios
     */
    @GetMapping("/plan/{planId}/contar")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<Long> contarPorPlanEstudios(@PathVariable String planId) {
        long count = semestreService.contarPorPlanEstudios(planId);
        return ResponseEntity.ok(count);
    }

    /**
     * Obtiene estadísticas de semestres
     */
    @GetMapping("/estadisticas")
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<SemestreService.EstadisticasSemestres> obtenerEstadisticas() {
        SemestreService.EstadisticasSemestres estadisticas = semestreService.obtenerEstadisticas();
        return ResponseEntity.ok(estadisticas);
    }

    /**
     * Obtiene semestres con asignaturas
     */
    @GetMapping("/plan/{planId}/con-asignaturas")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Semestre>> obtenerSemestresConAsignaturas(@PathVariable String planId) {
        List<Semestre> semestres = semestreService.obtenerSemestresConAsignaturas(planId);
        return ResponseEntity.ok(semestres);
    }

    // Clase de respuesta para créditos
    public static class CreditosResponse {
        private int creditos;

        public CreditosResponse(int creditos) {
            this.creditos = creditos;
        }

        public int getCreditos() { return creditos; }
        public void setCreditos(int creditos) { this.creditos = creditos; }
    }
}