package cue.edu.co.moduloasignaturas.factory;

import cue.edu.co.moduloasignaturas.model.Asignatura;

/**
 * Interfaz Factory para crear asignaturas
 * Implementa el patrón Factory Method
 */
public interface AsignaturaFactory {

    /**
     * Crea una asignatura con validaciones OCL
     * @param codigo código de la asignatura
     * @param nombre nombre de la asignatura
     * @param creditos número de créditos
     * @param horasTeoricas horas teóricas por semana
     * @param horasPracticas horas prácticas por semana
     * @return asignatura creada y validada
     * @throws IllegalArgumentException si no cumple reglas OCL
     */
    Asignatura crearAsignatura(String codigo, String nombre, Integer creditos,
                               Integer horasTeoricas, Integer horasPracticas);
}