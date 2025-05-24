package cue.edu.co.moduloasignaturas.builder;

import cue.edu.co.moduloasignaturas.model.PlanEstudios;
import cue.edu.co.moduloasignaturas.model.Semestre;
import cue.edu.co.moduloasignaturas.model.Asignatura;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

/**
 * Builder para construir PlanEstudios paso a paso
 * Implementa el patrón Builder garantizando cumplimiento de reglas OCL
 */
@Component
public class PlanEstudiosBuilder {

    private static final Logger log = LoggerFactory.getLogger(PlanEstudiosBuilder.class);

    private String codigo;
    private String nombre;
    private Integer duracionSemestres;
    private String descripcion;
    private String facultad;
    private String programa;
    private List<Semestre> semestres;

    public PlanEstudiosBuilder() {
        this.reset();
    }

    /**
     * Reinicia el builder para construir un nuevo plan
     */
    public PlanEstudiosBuilder reset() {
        this.codigo = null;
        this.nombre = null;
        this.duracionSemestres = null;
        this.descripcion = null;
        this.facultad = null;
        this.programa = null;
        this.semestres = new ArrayList<>();
        return this;
    }

    /**
     * Establece información básica del plan
     */
    public PlanEstudiosBuilder informacionBasica(String codigo, String nombre,
                                                 Integer duracionSemestres) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.duracionSemestres = duracionSemestres;
        return this;
    }

    /**
     * Establece la descripción del plan
     */
    public PlanEstudiosBuilder descripcion(String descripcion) {
        this.descripcion = descripcion;
        return this;
    }

    /**
     * Establece facultad y programa
     */
    public PlanEstudiosBuilder facultadPrograma(String facultad, String programa) {
        this.facultad = facultad;
        this.programa = programa;
        return this;
    }

    /**
     * Agrega un semestre al plan
     * Valida que el número de semestre sea válido según duracionSemestres
     */
    public PlanEstudiosBuilder agregarSemestre(Integer numero, String nombreSemestre) {
        // Validar número de semestre
        if (numero == null || numero <= 0) {
            throw new IllegalArgumentException("El número de semestre debe ser positivo");
        }

        if (duracionSemestres != null && numero > duracionSemestres) {
            throw new IllegalArgumentException(
                    "El número de semestre (" + numero +
                            ") excede la duración del plan (" + duracionSemestres + ")");
        }

        // Verificar que no exista ya un semestre con ese número
        boolean existeSemestre = semestres.stream()
                .anyMatch(s -> numero.equals(s.getNumero()));

        if (existeSemestre) {
            throw new IllegalArgumentException(
                    "Ya existe un semestre con número " + numero);
        }

        Semestre semestre = Semestre.builder()
                .numero(numero)
                .nombre(nombreSemestre != null ? nombreSemestre : "Semestre " + numero)
                .build();

        semestres.add(semestre);
        log.debug("Agregado semestre {} al plan", numero);
        return this;
    }

    /**
     * Agrega una asignatura a un semestre específico
     */
    public PlanEstudiosBuilder agregarAsignatura(Integer numeroSemestre,
                                                 Asignatura asignatura) {
        if (asignatura == null) {
            throw new IllegalArgumentException("La asignatura no puede ser nula");
        }

        Semestre semestre = buscarSemestre(numeroSemestre);
        if (semestre == null) {
            throw new IllegalArgumentException(
                    "No existe el semestre " + numeroSemestre);
        }

        semestre.agregarAsignatura(asignatura);
        log.debug("Agregada asignatura {} al semestre {}",
                asignatura.getCodigo(), numeroSemestre);
        return this;
    }

    /**
     * Construye el PlanEstudios final con todas las validaciones OCL
     */
    public PlanEstudios obtenerPlan() {
        // Validaciones previas
        validarDatosBasicos();

        PlanEstudios plan = PlanEstudios.builder()
                .codigo(codigo)
                .nombre(nombre)
                .duracionSemestres(duracionSemestres)
                .descripcion(descripcion)
                .facultad(facultad)
                .programa(programa)
                .semestres(new ArrayList<>(semestres))
                .activo(true)
                .build();

        // Establecer referencia del plan en los semestres
        semestres.forEach(s -> s.setPlanEstudiosId(plan.getId()));

        // Validar reglas OCL del plan completo
        validarReglasOCLPlan(plan);

        log.info("Plan de estudios construido exitosamente: {}", plan.getCodigo());
        return plan;
    }

    /**
     * Valida los datos básicos requeridos
     */
    private void validarDatosBasicos() {
        if (codigo == null || codigo.trim().isEmpty()) {
            throw new IllegalArgumentException("El código del plan es obligatorio");
        }

        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del plan es obligatorio");
        }

        if (duracionSemestres == null) {
            throw new IllegalArgumentException("La duración en semestres es obligatoria");
        }

        if (semestres.isEmpty()) {
            throw new IllegalArgumentException("El plan debe tener al menos un semestre");
        }
    }

    /**
     * Valida todas las reglas OCL del plan de estudios
     */
    private void validarReglasOCLPlan(PlanEstudios plan) {
        StringBuilder errores = new StringBuilder();

        // Validar duración válida
        if (!plan.validarDuracionValida()) {
            errores.append("La duración debe estar entre 8 y 12 semestres. ");
        }

        // Validar que tiene semestres
        if (!plan.validarTieneSemestres()) {
            errores.append("El plan debe tener al menos un semestre. ");
        }

        // Validar semestres únicos
        if (!plan.validarSemestreUnico()) {
            errores.append("Cada semestre debe tener un número único. ");
        }

        // Validar créditos totales
        if (!plan.validarCreditosTotalesValidos()) {
            errores.append("Los créditos totales no pueden exceder 200. ");
        }

        // Validar cada semestre individualmente
        for (Semestre semestre : semestres) {
            if (!semestre.validarTodasLasReglas(duracionSemestres)) {
                errores.append("El semestre ").append(semestre.getNumero())
                        .append(" no cumple las reglas OCL. ");
            }
        }

        // Validaciones adicionales de prerrequisitos
        if (!plan.validarPrerequisitosEnMismoPlan()) {
            errores.append("Todos los prerrequisitos deben estar en el mismo plan. ");
        }

        if (!plan.validarPrerequisitosNoEnPrimerSemestre()) {
            errores.append("Las asignaturas del primer semestre no pueden tener prerrequisitos. ");
        }

        if (errores.length() > 0) {
            String mensajeError = "Error construyendo plan " + plan.getCodigo() +
                    ": " + errores.toString();
            log.error(mensajeError);
            throw new IllegalArgumentException(mensajeError);
        }
    }

    /**
     * Busca un semestre por número
     */
    private Semestre buscarSemestre(Integer numero) {
        return semestres.stream()
                .filter(s -> numero.equals(s.getNumero()))
                .findFirst()
                .orElse(null);
    }

    /**
     * Obtiene estadísticas del plan en construcción
     */
    public String obtenerEstadisticas() {
        int totalAsignaturas = semestres.stream()
                .mapToInt(s -> s.getAsignaturas().size())
                .sum();

        int totalCreditos = semestres.stream()
                .mapToInt(Semestre::calcularCreditos)
                .sum();

        return String.format("Plan: %s - Semestres: %d, Asignaturas: %d, Créditos: %d",
                nombre, semestres.size(), totalAsignaturas, totalCreditos);
    }
}