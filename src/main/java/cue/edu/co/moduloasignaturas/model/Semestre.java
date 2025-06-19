package cue.edu.co.moduloasignaturas.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Entidad que representa un semestre académico en un plan de estudios.
 */
@Entity
@Table(name = "semestres")
public class Semestre {
    @Id
    private String id;

    @NotNull(message = "El número de semestre es obligatorio")
    @Min(1)
    private Integer numero;

    @NotBlank(message = "El nombre del semestre es obligatorio")
    private String nombre;

    @NotBlank(message = "El ID del plan de estudios es obligatorio")
    private String planEstudiosId;

    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "semestre_asignaturas",
            joinColumns = @JoinColumn(name = "semestre_id"),
            inverseJoinColumns = @JoinColumn(name = "asignatura_id")
    )
    private List<Asignatura> asignaturas = new ArrayList<>();

    public Semestre() {}

    public Semestre(String id, Integer numero, String nombre, String planEstudiosId) {
        this.id = id;
        this.numero = numero;
        this.nombre = nombre;
        this.planEstudiosId = planEstudiosId;
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

    public List<Asignatura> getAsignaturas() { return asignaturas; }
    public void setAsignaturas(List<Asignatura> asignaturas) { this.asignaturas = asignaturas; }

    // Métodos utilitarios

    /**
     * Agrega una asignatura al semestre.
     */
    public void agregarAsignatura(Asignatura asignatura) {
        if (asignaturas == null) asignaturas = new ArrayList<>();
        if (!asignaturas.contains(asignatura)) {
            asignaturas.add(asignatura);
        }
    }

    /**
     * Remueve una asignatura del semestre.
     */
    public void removerAsignatura(Asignatura asignatura) {
        if (asignaturas != null) {
            asignaturas.remove(asignatura);
        }
    }

    /**
     * Devuelve la lista de asignaturas, nunca nula.
     */
    public List<Asignatura> obtenerAsignaturas() {
        return asignaturas != null ? asignaturas : new ArrayList<>();
    }

    /**
     * Calcula el total de créditos del semestre sumando los créditos de cada asignatura.
     */
    public int calcularCreditos() {
        return asignaturas == null ? 0 :
                asignaturas.stream().mapToInt(Asignatura::getCreditos).sum();
    }

    /**
     * Valida si el semestre tiene al menos una asignatura.
     */
    public boolean validarTieneAsignaturas() {
        return asignaturas != null && !asignaturas.isEmpty();
    }

    /**
     * Valida todas las reglas del semestre según la duración máxima del plan.
     * Aquí puedes agregar más validaciones si lo necesitas.
     */
    public boolean validarTodasLasReglas(Integer duracionMaximaPlan) {
        if (numero == null || numero < 1) return false;
        if (duracionMaximaPlan != null && numero > duracionMaximaPlan) return false;
        return validarTieneAsignaturas();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Semestre)) return false;
        Semestre semestre = (Semestre) o;
        return Objects.equals(id, semestre.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}