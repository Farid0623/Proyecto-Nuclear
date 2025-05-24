package cue.edu.co.moduloasignaturas.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import cue.edu.co.moduloasignaturas.model.state.EstadoAsignatura;
import cue.edu.co.moduloasignaturas.model.state.AsignaturaActiva;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.index.Indexed;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Objects;

/**
 * Entidad Asignatura que implementa las reglas OCL:
 * - creditosPositivos: self.creditos > 0
 * - horasConsistentes: self.horasTeoricas + self.horasPracticas = self.creditos * 16
 * - codigoValido: self.codigo.size() >= 3 and self.codigo.size() <= 10
 * - noAutoPrerrequisito: not self.prerrequisito->includes(self)
 * - asignaturaInactivaNoAsignable: not self.activa implies self.horario->isEmpty()
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "asignaturas")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Asignatura implements ComponentePlan {

    @Id
    private String id;

    @NotBlank(message = "El código de la asignatura es obligatorio")
    @Size(min = 3, max = 10, message = "El código debe tener entre 3 y 10 caracteres")
    @Pattern(regexp = "^[A-Za-z0-9]+$", message = "El código solo puede contener caracteres alfanuméricos")
    @Indexed(unique = true)
    private String codigo;

    @NotBlank(message = "El nombre de la asignatura es obligatorio")
    private String nombre;

    @Positive(message = "Los créditos deben ser positivos")
    @Max(value = 10, message = "Los créditos no pueden exceder 10")
    private Integer creditos;

    @PositiveOrZero(message = "Las horas teóricas no pueden ser negativas")
    private Integer horasTeoricas;

    @PositiveOrZero(message = "Las horas prácticas no pueden ser negativas")
    private Integer horasPracticas;

    private String descripcion;

    @Builder.Default
    private Boolean activa = true;

    // Estado del patrón State
    @Builder.Default
    private transient EstadoAsignatura estado = new AsignaturaActiva();

    // Referencias a prerrequisitos
    @DBRef
    @Builder.Default
    private List<Asignatura> prerrequisitos = new ArrayList<>();

    // Horarios asociados
    @Builder.Default
    private List<Horario> horarios = new ArrayList<>();

    // Información de semestre (para validaciones)
    private Integer numeroSemestre;

    @CreatedDate
    private LocalDateTime fechaCreacion;

    @LastModifiedDate
    private LocalDateTime fechaModificacion;

    // Métodos de validación OCL

    /**
     * Valida que los créditos sean positivos
     * OCL: inv creditosPositivos: self.creditos > 0
     */
    public boolean validarCreditosPositivos() {
        return creditos != null && creditos > 0;
    }

    /**
     * Valida consistencia entre horas y créditos
     * OCL: inv horasConsistentes: self.horasTeoricas + self.horasPracticas = self.creditos * 16
     */
    public boolean validarHorasConsistentes() {
        if (creditos == null || horasTeoricas == null || horasPracticas == null) {
            return false;
        }
        return (horasTeoricas + horasPracticas) == (creditos * 16);
    }

    /**
     * Valida formato del código
     * OCL: inv codigoValido: self.codigo.size() >= 3 and self.codigo.size() <= 10
     */
    public boolean validarCodigoValido() {
        return codigo != null &&
                codigo.length() >= 3 &&
                codigo.length() <= 10 &&
                codigo.matches("^[A-Za-z0-9]+$");
    }

    /**
     * Valida que no sea prerrequisito de sí misma
     * OCL: inv noAutoPrerrequisito: not self.prerrequisito->includes(self)
     */
    public boolean validarNoAutoPrerrequisito() {
        return prerrequisitos == null || !prerrequisitos.contains(this);
    }

    /**
     * Valida que asignatura inactiva no tenga horarios
     * OCL: inv asignaturaInactivaNoAsignable: not self.activa implies self.horario->isEmpty()
     */
    public boolean validarAsignaturaInactivaNoAsignable() {
        if (!activa) {
            return horarios == null || horarios.isEmpty();
        }
        return true;
    }

    /**
     * Valida todas las reglas OCL
     */
    public boolean validarTodasLasReglas() {
        return validarCreditosPositivos() &&
                validarHorasConsistentes() &&
                validarCodigoValido() &&
                validarNoAutoPrerrequisito() &&
                validarAsignaturaInactivaNoAsignable();
    }

    // Métodos del patrón Composite
    @Override
    public void mostrarDetalles() {
        System.out.println("Asignatura: " + nombre + " (" + codigo + ") - " + creditos + " créditos");
    }

    @Override
    public int calcularCreditos() {
        return creditos != null ? creditos : 0;
    }

    @Override
    public void agregarComponente(ComponentePlan componente) {
        throw new UnsupportedOperationException("Una asignatura no puede contener otros componentes");
    }

    // Métodos del patrón State
    public void cambiarEstado(EstadoAsignatura nuevoEstado) {
        this.estado = nuevoEstado;
        this.activa = estado.esActiva();
    }

    public void realizarAccion() {
        estado.accion(this);
    }

    public boolean verificarDisponibilidad() {
        return activa && !horarios.isEmpty() &&
                horarios.stream().anyMatch(Horario::verificarDisponibilidad);
    }

    // Métodos para manejo de prerrequisitos
    public void agregarPrerrequisito(Asignatura prerrequisito) {
        if (prerrequisito != null && !prerrequisito.equals(this)) {
            if (prerrequisitos == null) {
                prerrequisitos = new ArrayList<>();
            }
            if (!prerrequisitos.contains(prerrequisito)) {
                prerrequisitos.add(prerrequisito);
            }
        }
    }

    public void removerPrerrequisito(Asignatura prerrequisito) {
        if (prerrequisitos != null) {
            prerrequisitos.remove(prerrequisito);
        }
    }

    public List<Asignatura> obtenerPrerrequisitos() {
        return prerrequisitos != null ? new ArrayList<>(prerrequisitos) : new ArrayList<>();
    }

    // Métodos para manejo de horarios
    public void agregarHorario(Horario horario) {
        if (horario != null) {
            if (horarios == null) {
                horarios = new ArrayList<>();
            }
            horarios.add(horario);
        }
    }

    public void limpiarHorarios() {
        if (horarios != null) {
            horarios.clear();
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Asignatura that = (Asignatura) o;
        return Objects.equals(codigo, that.codigo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(codigo);
    }

    @Override
    public String toString() {
        return "Asignatura{" +
                "codigo='" + codigo + '\'' +
                ", nombre='" + nombre + '\'' +
                ", creditos=" + creditos +
                ", activa=" + activa +
                '}';
    }
}