package cue.edu.co.moduloasignaturas.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", System.currentTimeMillis());
        response.put("service", "API Backend Universidad");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health/db")
    public ResponseEntity<Map<String, Object>> databaseHealth() {
        Map<String, Object> response = new HashMap<>();
        // Aquí puedes verificar la conexión a la base de datos
        response.put("status", "UP");
        response.put("database", "PostgreSQL");
        return ResponseEntity.ok(response);
    }
}
