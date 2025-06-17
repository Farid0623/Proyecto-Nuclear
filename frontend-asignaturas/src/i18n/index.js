import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Traducciones en español
const esTranslations = {
    common: {
        actions: {
            save: 'Guardar',
            cancel: 'Cancelar',
            edit: 'Editar',
            delete: 'Eliminar',
            create: 'Crear',
            search: 'Buscar',
            filter: 'Filtrar',
            clear: 'Limpiar',
            back: 'Volver',
            next: 'Siguiente',
            previous: 'Anterior',
            submit: 'Enviar',
            close: 'Cerrar',
            view: 'Ver',
            activate: 'Activar',
            deactivate: 'Desactivar'
        },
        labels: {
            code: 'Código',
            name: 'Nombre',
            description: 'Descripción',
            credits: 'Créditos',
            theoreticalHours: 'Horas Teóricas',
            practicalHours: 'Horas Prácticas',
            active: 'Activo',
            inactive: 'Inactivo',
            status: 'Estado',
            semester: 'Semestre',
            prerequisites: 'Prerrequisitos',
            schedule: 'Horario',
            day: 'Día',
            startTime: 'Hora Inicio',
            endTime: 'Hora Fin',
            classroom: 'Aula',
            classType: 'Tipo de Clase'
        },
        messages: {
            loading: 'Cargando...',
            success: 'Operación exitosa',
            error: 'Ha ocurrido un error',
            confirmDelete: '¿Está seguro de eliminar este elemento?',
            noData: 'No hay datos disponibles',
            saved: 'Guardado exitosamente',
            deleted: 'Eliminado exitosamente',
            updated: 'Actualizado exitosamente'
        },
        validation: {
            required: 'Este campo es obligatorio',
            minLength: 'Mínimo {{count}} caracteres',
            maxLength: 'Máximo {{count}} caracteres',
            positive: 'Debe ser un número positivo',
            invalid: 'Formato inválido',
            hoursConsistency: 'Las horas teóricas + prácticas deben ser igual a créditos × 16'
        }
    },
    navigation: {
        dashboard: 'Dashboard',
        subjects: 'Asignaturas',
        curriculum: 'Pensum',
        schedules: 'Horarios',
        settings: 'Configuración'
    },
    subjects: {
        title: 'Gestión de Asignaturas',
        subtitle: 'Administre las asignaturas del plan de estudios',
        createSubject: 'Crear Asignatura',
        editSubject: 'Editar Asignatura',
        subjectDetails: 'Detalles de la Asignatura',
        listTitle: 'Lista de Asignaturas',
        filters: {
            all: 'Todas',
            active: 'Activas',
            inactive: 'Inactivas',
            bySemester: 'Por Semestre',
            byCredits: 'Por Créditos'
        },
        form: {
            basicInfo: 'Información Básica',
            academicInfo: 'Información Académica',
            scheduleInfo: 'Información de Horario',
            codeHelp: 'Código único de 3-10 caracteres alfanuméricos',
            creditsHelp: 'Número de créditos académicos (1-10)',
            hoursHelp: 'Total de horas debe ser igual a créditos × 16'
        },
        validation: {
            codeExists: 'Ya existe una asignatura con este código',
            invalidCode: 'El código debe tener entre 3 y 10 caracteres alfanuméricos',
            invalidCredits: 'Los créditos deben ser entre 1 y 10',
            hoursInconsistent: 'Las horas no son consistentes con los créditos'
        },
        stats: {
            total: 'Total de Asignaturas',
            active: 'Asignaturas Activas',
            inactive: 'Asignaturas Inactivas',
            avgCredits: 'Promedio de Créditos'
        }
    },
    curriculum: {
        title: 'Gestión de Pensum',
        subtitle: 'Organice las asignaturas por semestres',
        studyPlan: 'Plan de Estudios',
        semester: 'Semestre {{number}}',
        totalCredits: 'Créditos Totales',
        semesterCredits: 'Créditos del Semestre',
        dragSubject: 'Arrastra asignatura aquí',
        addSubjectToSemester: 'Agregar Asignatura al Semestre',
        removeFromSemester: 'Quitar del Semestre',
        prerequisites: 'Prerrequisitos',
        validation: {
            semesterCredits: 'El semestre debe tener entre 12 y 20 créditos',
            totalCredits: 'El plan no puede exceder 200 créditos totales',
            prerequisiteOrder: 'Los prerrequisitos deben estar en semestres anteriores'
        }
    },
    schedules: {
        title: 'Gestión de Horarios',
        subtitle: 'Configure los horarios de las asignaturas',
        weeklySchedule: 'Horario Semanal',
        createSchedule: 'Crear Horario',
        editSchedule: 'Editar Horario',
        days: {
            monday: 'Lunes',
            tuesday: 'Martes',
            wednesday: 'Miércoles',
            thursday: 'Jueves',
            friday: 'Viernes',
            saturday: 'Sábado',
            sunday: 'Domingo'
        },
        classTypes: {
            theoretical: 'Teórica',
            practical: 'Práctica',
            laboratory: 'Laboratorio',
            seminar: 'Seminario'
        },
        validation: {
            timeConflict: 'Hay conflicto de horario con otra asignatura',
            invalidTime: 'La hora de fin debe ser posterior a la hora de inicio',
            duplicateSchedule: 'Ya existe un horario para esta asignatura en este horario'
        }
    },
    dashboard: {
        title: 'Dashboard - Sistema de Gestión de Asignaturas',
        welcome: 'Bienvenido al Sistema',
        overview: 'Resumen General',
        quickActions: 'Acciones Rápidas',
        recentActivity: 'Actividad Reciente',
        stats: {
            subjects: 'Asignaturas',
            semesters: 'Semestres',
            schedules: 'Horarios',
            students: 'Estudiantes'
        }
    }
};

// Traducciones en inglés
const enTranslations = {
    common: {
        actions: {
            save: 'Save',
            cancel: 'Cancel',
            edit: 'Edit',
            delete: 'Delete',
            create: 'Create',
            search: 'Search',
            filter: 'Filter',
            clear: 'Clear',
            back: 'Back',
            next: 'Next',
            previous: 'Previous',
            submit: 'Submit',
            close: 'Close',
            view: 'View',
            activate: 'Activate',
            deactivate: 'Deactivate'
        },
        labels: {
            code: 'Code',
            name: 'Name',
            description: 'Description',
            credits: 'Credits',
            theoreticalHours: 'Theoretical Hours',
            practicalHours: 'Practical Hours',
            active: 'Active',
            inactive: 'Inactive',
            status: 'Status',
            semester: 'Semester',
            prerequisites: 'Prerequisites',
            schedule: 'Schedule',
            day: 'Day',
            startTime: 'Start Time',
            endTime: 'End Time',
            classroom: 'Classroom',
            classType: 'Class Type'
        },
        messages: {
            loading: 'Loading...',
            success: 'Operation successful',
            error: 'An error occurred',
            confirmDelete: 'Are you sure you want to delete this item?',
            noData: 'No data available',
            saved: 'Saved successfully',
            deleted: 'Deleted successfully',
            updated: 'Updated successfully'
        },
        validation: {
            required: 'This field is required',
            minLength: 'Minimum {{count}} characters',
            maxLength: 'Maximum {{count}} characters',
            positive: 'Must be a positive number',
            invalid: 'Invalid format',
            hoursConsistency: 'Theoretical + practical hours must equal credits × 16'
        }
    },
    navigation: {
        dashboard: 'Dashboard',
        subjects: 'Subjects',
        curriculum: 'Curriculum',
        schedules: 'Schedules',
        settings: 'Settings'
    },
    subjects: {
        title: 'Subject Management',
        subtitle: 'Manage curriculum subjects',
        createSubject: 'Create Subject',
        editSubject: 'Edit Subject',
        subjectDetails: 'Subject Details',
        listTitle: 'Subject List',
        filters: {
            all: 'All',
            active: 'Active',
            inactive: 'Inactive',
            bySemester: 'By Semester',
            byCredits: 'By Credits'
        },
        form: {
            basicInfo: 'Basic Information',
            academicInfo: 'Academic Information',
            scheduleInfo: 'Schedule Information',
            codeHelp: 'Unique code of 3-10 alphanumeric characters',
            creditsHelp: 'Number of academic credits (1-10)',
            hoursHelp: 'Total hours must equal credits × 16'
        },
        validation: {
            codeExists: 'A subject with this code already exists',
            invalidCode: 'Code must be 3-10 alphanumeric characters',
            invalidCredits: 'Credits must be between 1 and 10',
            hoursInconsistent: 'Hours are inconsistent with credits'
        },
        stats: {
            total: 'Total Subjects',
            active: 'Active Subjects',
            inactive: 'Inactive Subjects',
            avgCredits: 'Average Credits'
        }
    },
    curriculum: {
        title: 'Curriculum Management',
        subtitle: 'Organize subjects by semesters',
        studyPlan: 'Study Plan',
        semester: 'Semester {{number}}',
        totalCredits: 'Total Credits',
        semesterCredits: 'Semester Credits',
        dragSubject: 'Drag subject here',
        addSubjectToSemester: 'Add Subject to Semester',
        removeFromSemester: 'Remove from Semester',
        prerequisites: 'Prerequisites',
        validation: {
            semesterCredits: 'Semester must have between 12 and 20 credits',
            totalCredits: 'Plan cannot exceed 200 total credits',
            prerequisiteOrder: 'Prerequisites must be in previous semesters'
        }
    },
    schedules: {
        title: 'Schedule Management',
        subtitle: 'Configure subject schedules',
        weeklySchedule: 'Weekly Schedule',
        createSchedule: 'Create Schedule',
        editSchedule: 'Edit Schedule',
        days: {
            monday: 'Monday',
            tuesday: 'Tuesday',
            wednesday: 'Wednesday',
            thursday: 'Thursday',
            friday: 'Friday',
            saturday: 'Saturday',
            sunday: 'Sunday'
        },
        classTypes: {
            theoretical: 'Theoretical',
            practical: 'Practical',
            laboratory: 'Laboratory',
            seminar: 'Seminar'
        },
        validation: {
            timeConflict: 'There is a schedule conflict with another subject',
            invalidTime: 'End time must be after start time',
            duplicateSchedule: 'A schedule already exists for this subject at this time'
        }
    },
    dashboard: {
        title: 'Dashboard - Subject Management System',
        welcome: 'Welcome to the System',
        overview: 'General Overview',
        quickActions: 'Quick Actions',
        recentActivity: 'Recent Activity',
        stats: {
            subjects: 'Subjects',
            semesters: 'Semesters',
            schedules: 'Schedules',
            students: 'Students'
        }
    }
};

const resources = {
    es: { translation: esTranslations },
    en: { translation: enTranslations }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'es',
        debug: process.env.NODE_ENV === 'development',

        interpolation: {
            escapeValue: false
        },

        detection: {
            order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
            caches: ['localStorage']
        }
    });

export default i18n;