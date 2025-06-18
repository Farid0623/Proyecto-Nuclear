package cue.edu.co.moduloasignaturas.controller;

import cue.edu.co.moduloasignaturas.model.PlanEstudios;
import cue.edu.co.moduloasignaturas.model.Semestre;
import cue.edu.co.moduloasignaturas.model.Asignatura;
import cue.edu.co.moduloasignaturas.service.PlanEstudiosService;
import cue.edu.co.moduloasignaturas.service.ServicioValidacion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Controlador REST para gestión de planes de estudios
 */
@RestController
@RequestMapping("/api/planes-estudios")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PlanEstudiosController {

    @Autowired
    private PlanEstudiosService planEstudiosService;

    @Autowired
    private ServicioValidacion servicioValidacion;

    /**
     * Obtiene todos los planes de estudios
     * Acceso: Profesores, Coordinadores y Administradores
     */
    @GetMapping
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<PlanEstudios>> obtenerTodos() {
        List<PlanEstudios> planes = planEstudiosService.obtenerTodos();
        return ResponseEntity.ok(planes);
    }

    /**
     * Obtiene un plan de estudios por ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<PlanEstudios> obtenerPorId(@PathVariable String id) {
        Optional<PlanEstudios> plan = planEstudiosService.obtenerPorId(id);
        return plan.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Obtiene un plan de estudios por código
     */
    @GetMapping("/codigo/{codigo}")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<PlanEstudios> obtenerPorCodigo(@PathVariable String codigo) {
        Optional<PlanEstudios> plan = planEstudiosService.obtenerPorCodigo(codigo);
        return plan.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Crea un nuevo plan de estudios
     * Acceso: Solo Coordinadores y Administradores
     */
    @PostMapping
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> crear(@Valid @RequestBody PlanEstudios plan) {
        try {
            // Validar reglas OCL
            if (!plan.validarTodasLasReglas()) {
                return ResponseEntity.badRequest()
                        .body("El plan de estudios no cumple con las reglas de validación");
            }

            PlanEstudios nuevoPlan = planEstudiosService.guardar(plan);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPlan);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error creando plan de estudios: " + e.getMessage());
        }
    }

    /**
     * Actualiza un plan de estudios existente
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> actualizar(@PathVariable String id,
                                        @Valid @RequestBody PlanEstudios plan) {
        try {
            if (!planEstudiosService.existePorId(id)) {
                return ResponseEntity.notFound().build();
            }

            if (!plan.validarTodasLasReglas()) {
                return ResponseEntity.badRequest()
                        .body("El plan de estudios no cumple con las reglas de validación");
            }

            plan.setId(id);
            PlanEstudios planActualizado = planEstudiosService.guardar(plan);
            return ResponseEntity.ok(planActualizado);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error actualizando plan de estudios: " + e.getMessage());
        }
    }

    /**
     * Elimina un plan de estudios
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        if (!planEstudiosService.existePorId(id)) {
            return ResponseEntity.notFound().build();
        }

        planEstudiosService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Obtiene planes activos
     */
    @GetMapping("/activos")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<PlanEstudios>> obtenerActivos() {
        List<PlanEstudios> planes = planEstudiosService.obtenerActivos();
        return ResponseEntity.ok(planes);
    }

    /**
     * Busca planes por nombre
     */
    @GetMapping("/buscar")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<PlanEstudios>> buscarPorNombre(@RequestParam String nombre) {
        List<PlanEstudios> planes = planEstudiosService.buscarPorNombre(nombre);
        return ResponseEntity.ok(planes);
    }

    /**
     * Obtiene planes por facultad
     */
    @GetMapping("/facultad/{facultad}")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<PlanEstudios>> obtenerPorFacultad(@PathVariable String facultad) {
        List<PlanEstudios> planes = planEstudiosService.obtenerPorFacultad(facultad);
        return ResponseEntity.ok(planes);
    }

    /**
     * Agrega un semestre al plan de estudios
     */
    @PostMapping("/{id}/semestres")
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> agregarSemestre(@PathVariable String id,
                                             @RequestBody Semestre semestre) {
        try {
            PlanEstudios plan = planEstudiosService.agregarSemestre(id, semestre);
            return ResponseEntity.ok(plan);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error agregando semestre: " + e.getMessage());
        }
    }

    /**
     * Remueve un semestre del plan de estudios
     */
    @DeleteMapping("/{planId}/semestres/{semestreId}")
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> removerSemestre(@PathVariable String planId,
                                             @PathVariable String semestreId) {
        try {
            PlanEstudios plan = planEstudiosService.removerSemestre(planId, semestreId);
            return ResponseEntity.ok(plan);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error removiendo semestre: " + e.getMessage());
        }
    }

    /**
     * Obtiene asignaturas de un semestre específico
     */
    @GetMapping("/{id}/semestres/{numeroSemestre}/asignaturas")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> obtenerAsignaturasPorSemestre(@PathVariable String id,
                                                           @PathVariable Integer numeroSemestre) {
        try {
            Optional<PlanEstudios> planOpt = planEstudiosService.obtenerPorId(id);
            if (planOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Set<Asignatura> asignaturas = planOpt.get().obtenerAsignaturasPorSemestre(numeroSemestre);
            return ResponseEntity.ok(asignaturas);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error obteniendo asignaturas: " + e.getMessage());
        }
    }

    /**
     * Obtiene todas las asignaturas del plan
     */
    @GetMapping("/{id}/asignaturas")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> obtenerTodasLasAsignaturas(@PathVariable String id) {
        try {
            Optional<PlanEstudios> planOpt = planEstudiosService.obtenerPorId(id);
            if (planOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            List<Asignatura> asignaturas = planOpt.get().obtenerTodasLasAsignaturas();
            return ResponseEntity.ok(asignaturas);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error obteniendo asignaturas: " + e.getMessage());
        }
    }

    /**
     * Calcula créditos totales del plan
     */
    @GetMapping("/{id}/creditos")
    @PreAuthorize("hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> calcularCreditos(@PathVariable String id) {
        try {
            Optional<PlanEstudios> planOpt = planEstudiosService.obtenerPorId(id);
            if (planOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            int creditos = planOpt.get().calcularCreditos();
            return ResponseEntity.ok(new CreditosResponse(creditos));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error calculando créditos: " + e.getMessage());
        }
    }

    /**
     * Cambia el estado de un plan (activo/inactivo)
     */
    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> cambiarEstado(@PathVariable String id,
                                           @RequestParam boolean activo) {
        try {
            PlanEstudios plan = planEstudiosService.cambiarEstado(id, activo);
            return ResponseEntity.ok(plan);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error cambiando estado: " + e.getMessage());
        }
    }

    /**
     * Valida un plan de estudios sin guardarlo
     */
    @PostMapping("/validar")
    @PreAuthorize("hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> validarPlan(@RequestBody PlanEstudios plan) {
        try {
            boolean esValido = plan.validarTodasLasReglas();

            if (esValido) {
                return ResponseEntity.ok(new ValidationResponse(true, "Plan de estudios válido"));
            } else {
                return ResponseEntity.badRequest()
                        .body(new ValidationResponse(false, "Plan de estudios no cumple las reglas de validación"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ValidationResponse(false, "Error validando plan: " + e.getMessage()));
        }
    }

    /**
     * Endpoint para alumnos - información básica de planes
     */
    @GetMapping("/publicos")
    @PreAuthorize("hasRole('ALUMNO') or hasRole('PROFESOR') or hasRole('COORDINADOR') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<PlanEstudiosBasico>> obtenerPlanesPublicos() {
        List<PlanEstudios> planes = planEstudiosService.obtenerActivos();
        List<PlanEstudiosBasico> planesBasicos = planes.stream()
                .map(p -> new PlanEstudiosBasico(
                        p.getId(),
                        p.getCodigo(),
                        p.getNombre(),
                        p.getFacultad(),
                        p.getPrograma(),
                        p.getDuracionSemestres(),
                        p.calcularCreditos()))
                .toList();
        return ResponseEntity.ok(planesBasicos);
    }

    // Clases de respuesta
    public static class CreditosResponse {
        private int creditos;

        public CreditosResponse(int creditos) {
            this.creditos = creditos;
        }

        public int getCreditos() { return creditos; }
        public void setCreditos(int creditos) { this.creditos = creditos; }
    }

    public static class ValidationResponse {
        private boolean valido;
        private String mensaje;

        public ValidationResponse(boolean valido, String mensaje) {
            this.valido = valido;
            this.mensaje = mensaje;
        }

        public boolean isValido() { return valido; }
        public void setValido(boolean valido) { this.valido = valido; }

        public String getMensaje() { return mensaje; }
        public void setMensaje(String mensaje) { this.mensaje = mensaje; }
    }

    public static class PlanEstudiosBasico {
        private String id;
        private String codigo;
        private String nombre;
        private String facultad;
        private String programa;
        private Integer duracionSemestres;
        private int creditosTotales;

        public PlanEstudiosBasico(String id, String codigo, String nombre, String facultad,
                                  String programa, Integer duracionSemestres, int creditosTotales) {
            this.id = id;
            this.codigo = codigo;
            this.nombre = nombre;
            this.facultad = facultad;
            this.programa = programa;
            this.duracionSemestres = duracionSemestres;
            this.creditosTotales = creditosTotales;
        }

        // Getters
        public String getId() { return id; }
        public String getCodigo() { return codigo; }
        public String getNombre() { return nombre; }
        public String getFacultad() { return facultad; }
        public String getPrograma() { return programa; }
        public Integer getDuracionSemestres() { return duracionSemestres; }
        public int getCreditosTotales() { return creditosTotales; }
    }
}