package cue.edu.co.moduloasignaturas.service;

import cue.edu.co.moduloasignaturas.model.Asignatura;
import java.util.List;
import java.util.Optional;

public interface AsignaturaService {
    Asignatura crearAsignatura(Asignatura asignatura);
    Asignatura crearAsignatura(String nombre, String codigo, int creditos, int horasTeoricas, int horasPracticas);
    List<Asignatura> obtenerTodas();
    Optional<Asignatura> obtenerPorId(String id);
    Asignatura actualizarAsignatura(String id, Asignatura asignatura);
    boolean eliminarAsignatura(String id);
    List<Asignatura> obtenerPorSemestre(int semestre);

    // Métodos para los tests
    Asignatura guardar(Asignatura asignatura);
    Asignatura buscarPorNombre(String nombre);
    List<Asignatura> obtenerPorCreditos(int creditos);
    List<Asignatura> obtenerActivas();
    Asignatura cambiarEstado(String codigo, boolean activa);
    Asignatura obtenerPorCodigo(String codigo);
}