package cue.edu.co.moduloasignaturas.observer;

import cue.edu.co.moduloasignaturas.model.Asignatura;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

/**
 * Clase Profesor que implementa Observer
 * Recibe notificaciones sobre cambios en el pensum
 */
@Component
public class Profesor implements Observer {

    private static final Logger log = LoggerFactory.getLogger(Profesor.class);

    private String id;
    private String nombre;
    private String email;
    private String departamento;
    private List<String> notificacionesRecibidas;
    private List<Asignatura> asignaturasAsignadas;

    public Profesor() {
        this.notificacionesRecibidas = new ArrayList<>();
        this.asignaturasAsignadas = new ArrayList<>();
    }

    public Profesor(String id, String nombre, String email, String departamento) {
        this();
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.departamento = departamento;
    }

    @Override
    public void actualizar(String mensaje, TipoCambio tipo, Object datos) {
        String notificacionCompleta = String.format("[%s] %s: %s",
                LocalDateTime.now(), tipo.getDescripcion(), mensaje);

        notificacionesRecibidas.add(notificacionCompleta);

        // Procesamiento específico según el tipo de cambio
        switch (tipo) {
            case ASIGNATURA_AGREGADA:
                procesarAsignaturaAgregada(mensaje, datos);
                break;
            case ASIGNATURA_ELIMINADA:
                procesarAsignaturaEliminada(mensaje, datos);
                break;
            case ASIGNATURA_MODIFICADA:
                procesarAsignaturaModificada(mensaje, datos);
                break;
            case ASIGNATURA_DESACTIVADA:
                procesarAsignaturaDesactivada(mensaje, datos);
                break;
            case HORARIO_CAMBIADO:
                procesarCambioHorario(mensaje, datos);
                break;
            default:
                procesarOtroCambio(mensaje, tipo, datos);
        }

        log.info("Profesor {} notificado: {}", nombre, mensaje);
    }

    /**
     * Procesa cuando se agrega una nueva asignatura
     */
    private void procesarAsignaturaAgregada(String mensaje, Object datos) {
        if (datos instanceof Asignatura) {
            Asignatura nuevaAsignatura = (Asignatura) datos;
            log.info("Profesor {} informado sobre nueva asignatura: {}",
                    nombre, nuevaAsignatura.getCodigo());

            // El profesor puede solicitar dictar la nueva asignatura
            evaluarAsignacionAsignatura(nuevaAsignatura);
        }
    }

    /**
     * Procesa cuando se elimina una asignatura
     */
    private void procesarAsignaturaEliminada(String mensaje, Object datos) {
        if (datos instanceof Asignatura) {
            Asignatura asignaturaEliminada = (Asignatura) datos;

            // Verificar si el profesor dictaba esta asignatura
            if (asignaturasAsignadas.contains(asignaturaEliminada)) {
                asignaturasAsignadas.remove(asignaturaEliminada);
                log.warn("Profesor {} ya no dictará la asignatura eliminada: {}",
                        nombre, asignaturaEliminada.getCodigo());
            }
        }
    }

    /**
     * Procesa modificaciones en asignaturas
     */
    private void procesarAsignaturaModificada(String mensaje, Object datos) {
        if (datos instanceof Asignatura) {
            Asignatura asignaturaModificada = (Asignatura) datos;

            // Si el profesor dicta esta asignatura, actualizar información
            if (asignaturasAsignadas.contains(asignaturaModificada)) {
                log.info("Profesor {} informado sobre modificación en su asignatura: {}",
                        nombre, asignaturaModificada.getCodigo());

                // Actualizar material de clase, syllabus, etc.
                actualizarMaterialClase(asignaturaModificada);
            }
        }
    }

    /**
     * Procesa cuando una asignatura se desactiva
     */
    private void procesarAsignaturaDesactivada(String mensaje, Object datos) {
        if (datos instanceof Asignatura) {
            Asignatura asignaturaDesactivada = (Asignatura) datos;

            if (asignaturasAsignadas.contains(asignaturaDesactivada)) {
                log.warn("Profesor {} informado: su asignatura {} ha sido desactivada",
                        nombre, asignaturaDesactivada.getCodigo());
            }
        }
    }

    /**
     * Procesa cambios de horario
     */
    private void procesarCambioHorario(String mensaje, Object datos) {
        log.info("Profesor {} informado sobre cambio de horario: {}", nombre, mensaje);
        // Actualizar calendario personal del profesor
    }

    /**
     * Procesa otros tipos de cambios
     */
    private void procesarOtroCambio(String mensaje, TipoCambio tipo, Object datos) {
        log.info("Profesor {} informado sobre {}: {}", nombre, tipo.getDescripcion(), mensaje);
    }

    /**
     * Evalúa si el profesor puede/quiere dictar una nueva asignatura
     */
    private void evaluarAsignacionAsignatura(Asignatura asignatura) {
        // Lógica para determinar si el profesor está calificado para la asignatura
        // Por simplicidad, asumimos que puede dictar asignaturas de su departamento
        log.debug("Profesor {} evaluando asignación de asignatura {}",
                nombre, asignatura.getCodigo());
    }

    /**
     * Actualiza material de clase cuando cambia una asignatura
     */
    private void actualizarMaterialClase(Asignatura asignatura) {
        log.info("Profesor {} actualizando material para asignatura {}",
                nombre, asignatura.getCodigo());
    }

    /**
     * Asigna una asignatura al profesor
     */
    public void asignarAsignatura(Asignatura asignatura) {
        if (asignatura != null && !asignaturasAsignadas.contains(asignatura)) {
            asignaturasAsignadas.add(asignatura);
            log.info("Asignatura {} asignada al profesor {}",
                    asignatura.getCodigo(), nombre);
        }
    }

    /**
     * Remueve una asignatura del profesor
     */
    public void removerAsignatura(Asignatura asignatura) {
        if (asignaturasAsignadas.remove(asignatura)) {
            log.info("Asignatura {} removida del profesor {}",
                    asignatura.getCodigo(), nombre);
        }
    }

    /**
     * Obtiene el resumen de notificaciones recientes
     */
    public List<String> obtenerNotificacionesRecientes(int limite) {
        int inicio = Math.max(0, notificacionesRecibidas.size() - limite);
        return notificacionesRecibidas.subList(inicio, notificacionesRecibidas.size());
    }

    // Getters y Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDepartamento() { return departamento; }
    public void setDepartamento(String departamento) { this.departamento = departamento; }

    public List<String> getNotificacionesRecibidas() {
        return new ArrayList<>(notificacionesRecibidas);
    }

    public List<Asignatura> getAsignaturasAsignadas() {
        return new ArrayList<>(asignaturasAsignadas);
    }

    @Override
    public String toString() {
        return "Profesor{" +
                "id='" + id + '\'' +
                ", nombre='" + nombre + '\'' +
                ", departamento='" + departamento + '\'' +
                ", asignaturasAsignadas=" + asignaturasAsignadas.size() +
                ", notificaciones=" + notificacionesRecibidas.size() +
                '}';
    }
}