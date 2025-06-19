package cue.edu.co.moduloasignaturas.dto;

import java.util.List;

public class AsignaturaDTO {
    private String id;
    private String codigo;
    private String nombre;
    private int creditos;
    private int horasTeoricas;
    private int horasPracticas;
    private boolean activa;
    private int semestre;
    private List<String> prerrequisitos;

    // Getters y Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public int getCreditos() { return creditos; }
    public void setCreditos(int creditos) { this.creditos = creditos; }

    public int getHorasTeoricas() { return horasTeoricas; }
    public void setHorasTeoricas(int horasTeoricas) { this.horasTeoricas = horasTeoricas; }

    public int getHorasPracticas() { return horasPracticas; }
    public void setHorasPracticas(int horasPracticas) { this.horasPracticas = horasPracticas; }

    public boolean isActiva() { return activa; }
    public void setActiva(boolean activa) { this.activa = activa; }

    public int getSemestre() { return semestre; }
    public void setSemestre(int semestre) { this.semestre = semestre; }

    public List<String> getPrerrequisitos() { return prerrequisitos; }
    public void setPrerrequisitos(List<String> prerrequisitos) { this.prerrequisitos = prerrequisitos; }
}