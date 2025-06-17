export const API_ENDPOINTS = {
    ASIGNATURAS: '/asignaturas',
    PENSUM: '/pensum',
    HORARIOS: '/horarios',
    USUARIOS: '/usuarios',
    REPORTES: '/reportes'
};

export const ROLES = {
    ADMINISTRADOR: 'administrador',
    COORDINADOR: 'coordinador',
    PROFESOR: 'profesor',
    ESTUDIANTE: 'estudiante'
};

export const ESTADOS_ASIGNATURA = {
    ACTIVA: true,
    INACTIVA: false
};

export const CREDITOS_LIMITES = {
    MIN: 1,
    MAX: 10
};

export const SEMESTRE_CREDITOS = {
    MIN: 12,
    MAX: 20
};

export const DIAS_SEMANA = [
    { value: 'LUNES', label: 'Lunes', short: 'L' },
    { value: 'MARTES', label: 'Martes', short: 'M' },
    { value: 'MIERCOLES', label: 'Miércoles', short: 'X' },
    { value: 'JUEVES', label: 'Jueves', short: 'J' },
    { value: 'VIERNES', label: 'Viernes', short: 'V' },
    { value: 'SABADO', label: 'Sábado', short: 'S' }
];

export const TIPOS_CLASE = [
    { value: 'TEORICA', label: 'Teórica' },
    { value: 'PRACTICA', label: 'Práctica' },
    { value: 'LABORATORIO', label: 'Laboratorio' },
    { value: 'SEMINARIO', label: 'Seminario' }
];

export const HORAS_ACADEMICAS = Array.from({ length: 14 }, (_, i) => {
    const hour = i + 6;
    return {
        value: `${hour.toString().padStart(2, '0')}:00`,
        label: `${hour.toString().padStart(2, '0')}:00`
    };
});