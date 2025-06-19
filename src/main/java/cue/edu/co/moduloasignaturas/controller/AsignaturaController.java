package cue.edu.co.moduloasignaturas.controller;

import cue.edu.co.moduloasignaturas.model.Asignatura;
import cue.edu.co.moduloasignaturas.service.AsignaturaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asignaturas")
public class AsignaturaController {

    private AsignaturaService asignaturaService;

    @PostMapping
    public ResponseEntity<Asignatura> crearAsignatura(@RequestBody Asignatura asignatura) {
        // Aquí puedes validar datos antes de guardar
        return ResponseEntity.ok(asignaturaService.crearAsignatura(asignatura));
    }

    @GetMapping
    public ResponseEntity<List<Asignatura>> obtenerTodas() {
        return ResponseEntity.ok(asignaturaService.obtenerTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Asignatura> obtenerPorId(@PathVariable String id) {
        return asignaturaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Asignatura> actualizarAsignatura(@PathVariable String id, @RequestBody Asignatura asignatura) {
        Asignatura actualizada = asignaturaService.actualizarAsignatura(id, asignatura);
        if (actualizada == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(actualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarAsignatura(@PathVariable String id) {
        if (asignaturaService.eliminarAsignatura(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/semestre/{numero}")
    public ResponseEntity<List<Asignatura>> obtenerPorSemestre(@PathVariable int numero) {
        return ResponseEntity.ok(asignaturaService.obtenerPorSemestre(numero));
    }
}