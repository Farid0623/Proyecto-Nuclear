package cue.edu.co.moduloasignaturas.service;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "asignaturas")
public class Asignatura {
    @Id
    private String id;
    private String nombre;
    private String codigo;
    private Integer creditos;
    private Integer horasTeoricas;
    private Integer horasPracticas;
    private Integer semestre;
    private Boolean activa;

    public Asignatura(String id, String nombre, String codigo, Integer creditos, Integer horasTeoricas, Integer horasPracticas, Integer semestre, Boolean activa) {
        this.id = id;
        this.nombre = nombre;
        this.codigo = codigo;
        this.creditos = creditos;
        this.horasTeoricas = horasTeoricas;
        this.horasPracticas = horasPracticas;
        this.semestre = semestre;
        this.activa = activa;
    }

    // Getters y setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public Integer getCreditos() { return creditos; }
    public void setCreditos(Integer creditos) { this.creditos = creditos; }

    public Integer getHorasTeoricas() { return horasTeoricas; }
    public void setHorasTeoricas(Integer horasTeoricas) { this.horasTeoricas = horasTeoricas; }

    public Integer getHorasPracticas() { return horasPracticas; }
    public void setHorasPracticas(Integer horasPracticas) { this.horasPracticas = horasPracticas; }

    public Integer getSemestre() { return semestre; }
    public void setSemestre(Integer semestre) { this.semestre = semestre; }

    public Boolean getActiva() { return activa; }
    public void setActiva(Boolean activa) { this.activa = activa; }

    // Builder manual
    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private String id;
        private String nombre;
        private String codigo;
        private Integer creditos;
        private Integer horasTeoricas;
        private Integer horasPracticas;
        private Integer semestre;
        private Boolean activa;

        public Builder id(String id) { this.id = id; return this; }
        public Builder nombre(String nombre) { this.nombre = nombre; return this; }
        public Builder codigo(String codigo) { this.codigo = codigo; return this; }
        public Builder creditos(Integer creditos) { this.creditos = creditos; return this; }
        public Builder horasTeoricas(Integer horasTeoricas) { this.horasTeoricas = horasTeoricas; return this; }
        public Builder horasPracticas(Integer horasPracticas) { this.horasPracticas = horasPracticas; return this; }
        public Builder semestre(Integer semestre) { this.semestre = semestre; return this; }
        public Builder activa(Boolean activa) { this.activa = activa; return this; }
        public Asignatura build() {
            return new Asignatura(id, nombre, codigo, creditos, horasTeoricas, horasPracticas, semestre, activa);
        }
    }
}