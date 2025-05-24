package cue.edu.co.moduloasignaturas.builder;

import cue.edu.co.moduloasignaturas.model.PlanEstudios;
import cue.edu.co.moduloasignaturas.model.Asignatura;
import cue.edu.co.moduloasignaturas.factory.AsignaturaFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Director que coordina la construcción de planes de estudio complejos
 * Implementa patrones predefinidos de construcción
 */
@Component
public class DirectorPlanEstudios {

    private static final Logger log = LoggerFactory.getLogger(DirectorPlanEstudios.class);

    @Autowired
    private PlanEstudiosBuilder builder;

    @Autowired
    private AsignaturaFactory asignaturaFactory;

    /**
     * Construye a plan de estudios estándar de ingeniería (10 semestres)
     */
    public PlanEstudios construirPlanIngenieria(String codigo, String nombre,
                                                String programa, String facultad) {
        log.info("Construyendo plan de ingeniería: {}", nombre);

        return builder.reset()
                .informacionBasica(codigo, nombre, 10)
                .facultadPrograma(facultad, programa)
                .descripcion("Plan de estudios de " + programa + " - " + facultad)

                // Primer semestre - materias básicas
                .agregarSemestre(1, "Primer Semestre")
                .agregarAsignatura(1, crearMatematicas1())
                .agregarAsignatura(1, crearFisica1())
                .agregarAsignatura(1, crearQuimica())
                .agregarAsignatura(1, crearIntroduccionIngenieria())

                // Segundo semestre
                .agregarSemestre(2, "Segundo Semestre")
                .agregarAsignatura(2, crearMatematicas2())
                .agregarAsignatura(2, crearFisica2())
                .agregarAsignatura(2, crearProgramacion1())
                .agregarAsignatura(2, crearExpresionGrafica())

                .obtenerPlan();
    }

    /**
     * Construye un plan de estudios básico (8 semestres)
     */
    public PlanEstudios construirPlanBasico(String codigo, String nombre,
                                            String programa, String facultad) {
        log.info("Construyendo plan básico: {}", nombre);

        return builder.reset()
                .informacionBasica(codigo, nombre, 8)
                .facultadPrograma(facultad, programa)
                .descripcion("Plan de estudios básico de " + programa)

                .agregarSemestre(1, "Primer Semestre")
                .agregarAsignatura(1, crearAsignaturaBasica("MAT101", "Matemáticas I", 4))
                .agregarAsignatura(1, crearAsignaturaBasica("ESP101", "Español", 3))
                .agregarAsignatura(1, crearAsignaturaBasica("INT101", "Introducción", 2))

                .obtenerPlan();
    }

    /**
     * Construye un plan personalizado basado en una configuración
     */
    public PlanEstudios construirPlanPersonalizado(ConfiguracionPlan config) {
        log.info("Construyendo plan personalizado: {}", config.getNombre());

        PlanEstudiosBuilder planBuilder = builder.reset()
                .informacionBasica(config.getCodigo(), config.getNombre(),
                        config.getDuracionSemestres())
                .facultadPrograma(config.getFacultad(), config.getPrograma())
                .descripcion(config.getDescripcion());

        // Agregar semestres según configuración
        for (int i = 1; i <= config.getDuracionSemestres(); i++) {
            planBuilder.agregarSemestre(i, "Semestre " + i);
        }

        // Agregar asignaturas según configuración
        if (config.getAsignaturas() != null) {
            config.getAsignaturas().forEach((semestre, asignaturas) -> {
                asignaturas.forEach(asigInfo -> {
                    Asignatura asignatura = asignaturaFactory.crearAsignatura(
                            asigInfo.getCodigo(),
                            asigInfo.getNombre(),
                            asigInfo.getCreditos(),
                            asigInfo.getHorasTeoricas(),
                            asigInfo.getHorasPracticas()
                    );
                    planBuilder.agregarAsignatura(semestre, asignatura);
                });
            });
        }

        return planBuilder.obtenerPlan();
    }

    // Métodos auxiliares para crear asignaturas típicas

    private Asignatura crearMatematicas1() {
        return asignaturaFactory.crearAsignatura("MAT101", "Matemáticas I", 4, 48, 16);
    }

    private Asignatura crearMatematicas2() {
        Asignatura mat2 = asignaturaFactory.crearAsignatura("MAT102", "Matemáticas II", 4, 48, 16);
        mat2.agregarPrerrequisito(crearMatematicas1());
        return mat2;
    }

    private Asignatura crearFisica1() {
        return asignaturaFactory.crearAsignatura("FIS101", "Física I", 4, 48, 16);
    }

    private Asignatura crearFisica2() {
        Asignatura fis2 = asignaturaFactory.crearAsignatura("FIS102", "Física II", 4, 48, 16);
        fis2.agregarPrerrequisito(crearFisica1());
        fis2.agregarPrerrequisito(crearMatematicas1());
        return fis2;
    }

    private Asignatura crearQuimica() {
        return asignaturaFactory.crearAsignatura("QUI101", "Química General", 3, 32, 16);
    }

    private Asignatura crearIntroduccionIngenieria() {
        return asignaturaFactory.crearAsignatura("ING101", "Introducción a la Ingeniería", 2, 32, 0);
    }

    private Asignatura crearProgramacion1() {
        return asignaturaFactory.crearAsignatura("PRG101", "Programación I", 3, 32, 16);
    }

    private Asignatura crearExpresionGrafica() {
        return asignaturaFactory.crearAsignatura("EXG101", "Expresión Gráfica", 2, 16, 16);
    }

    private Asignatura crearAsignaturaBasica(String codigo, String nombre, Integer creditos) {
        return asignaturaFactory.crearAsignatura(codigo, nombre, creditos,
                creditos * 12, creditos * 4);
    }
}