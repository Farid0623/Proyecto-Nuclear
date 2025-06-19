package cue.edu.co.moduloasignaturas.dto;

import java.util.List;

/**
 * DTO para transferir datos de Semestre
 */
public class SemestreDTO {
    private String id;
    private Integer numero;
    private String nombre;
    private String planEstudiosId;
    private List<AsignaturaDTO> asignaturas;

    public SemestreDTO() {}

    public SemestreDTO(String id, Integer numero, String nombre, String planEstudiosId, List<AsignaturaDTO> asignaturas) {
        this.id = id;
        this.numero = numero;
        this.nombre = nombre;
        this.planEstudiosId = planEstudiosId;
        this.asignaturas = asignaturas;
    }

    // Getters y Setters

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Integer getNumero() { return numero; }
    public void setNumero(Integer numero) { this.numero = numero; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getPlanEstudiosId() { return planEstudiosId; }
    public void setPlanEstudiosId(String planEstudiosId) { this.planEstudiosId = planEstudiosId; }

    public List<AsignaturaDTO> getAsignaturas() { return asignaturas; }
    public void setAsignaturas(List<AsignaturaDTO> asignaturas) { this.asignaturas = asignaturas; }
}