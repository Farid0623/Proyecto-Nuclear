package cue.edu.co.moduloasignaturas.dto;

import lombok.Data;

@Data
public class CrearPlanEstudiosDTO {
    private String nombre;
    private String codigo;
    private Integer duracionSemestres;
    private String descripcion;
    private String facultad;
    private String programa;
}
