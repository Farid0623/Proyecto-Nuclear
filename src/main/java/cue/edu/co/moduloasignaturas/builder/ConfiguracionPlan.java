package cue.edu.co.moduloasignaturas.builder;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Map;
import java.util.List;

/**
 * Configuración para construcción personalizada de planes de estudio
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConfiguracionPlan {

    private String codigo;
    private String nombre;
    private Integer duracionSemestres;
    private String descripcion;
    private String facultad;
    private String programa;

    // Mapa de semestre -> lista de asignaturas
    private Map<Integer, List<AsignaturaInfo>> asignaturas;

    /**
     * Información básica de una asignatura para configuración
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AsignaturaInfo {
        private String codigo;
        private String nombre;
        private Integer creditos;
        private Integer horasTeoricas;
        private Integer horasPracticas;
        private List<String> prerrequisitos; // Códigos de prerrequisitos
    }
}