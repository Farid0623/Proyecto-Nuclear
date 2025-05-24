package cue.edu.co.moduloasignaturas.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalTime;
import java.time.DayOfWeek;

/**
 * Clase Horario para representar los horarios de las asignaturas
 * Implementa validaciones para evitar conflictos de horario
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Horario {

    @NotNull(message = "El día de la semana es obligatorio")
    private DayOfWeek dia;

    @NotNull(message = "La hora de inicio es obligatoria")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaInicio;

    @NotNull(message = "La hora de fin es obligatoria")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaFin;

    @NotBlank(message = "El aula es obligatoria")
    private String aula;

    private String tipoClase; // Teórica, Práctica, Laboratorio

    /**
     * Verifica si el horario está disponible (no hay conflictos)
     */
    public boolean verificarDisponibilidad() {
        return horaInicio != null && horaFin != null &&
                horaInicio.isBefore(horaFin) && aula != null && !aula.trim().isEmpty();
    }

    /**
     * Verifica si hay conflicto con otro horario
     * OCL: Implementa la lógica de noConflictoHorario del estudiante
     */
    public boolean tieneConflictoCon(Horario otroHorario) {
        if (otroHorario == null || !this.dia.equals(otroHorario.dia)) {
            return false;
        }

        // Verifica solapamiento de horarios
        return (this.horaInicio.compareTo(otroHorario.horaInicio) >= 0 &&
                this.horaInicio.compareTo(otroHorario.horaFin) < 0) ||
                (this.horaFin.compareTo(otroHorario.horaInicio) > 0 &&
                        this.horaFin.compareTo(otroHorario.horaFin) <= 0) ||
                (this.horaInicio.compareTo(otroHorario.horaInicio) <= 0 &&
                        this.horaFin.compareTo(otroHorario.horaFin) >= 0);
    }

    /**
     * Calcula la duración del horario en minutos
     */
    public long getDuracionEnMinutos() {
        if (horaInicio != null && horaFin != null) {
            return horaFin.toSecondOfDay() / 60 - horaInicio.toSecondOfDay() / 60;
        }
        return 0;
    }

    @Override
    public String toString() {
        return String.format("%s %s-%s [%s]",
                dia.name(), horaInicio, horaFin, aula);
    }
}