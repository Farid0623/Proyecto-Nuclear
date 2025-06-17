export const validationRules = {
    asignatura: {
        codigo: {
            required: 'El código es obligatorio',
            pattern: {
                value: /^[A-Za-z0-9]{3,10}$/,
                message: 'El código debe tener entre 3 y 10 caracteres alfanuméricos'
            }
        },
        nombre: {
            required: 'El nombre es obligatorio',
            minLength: {
                value: 3,
                message: 'El nombre debe tener al menos 3 caracteres'
            },
            maxLength: {
                value: 100,
                message: 'El nombre no puede exceder 100 caracteres'
            }
        },
        creditos: {
            required: 'Los créditos son obligatorios',
            min: {
                value: 1,
                message: 'Los créditos deben ser al menos 1'
            },
            max: {
                value: 10,
                message: 'Los créditos no pueden exceder 10'
            }
        },
        horasTeoricas: {
            required: 'Las horas teóricas son obligatorias',
            min: {
                value: 0,
                message: 'Las horas teóricas no pueden ser negativas'
            }
        },
        horasPracticas: {
            required: 'Las horas prácticas son obligatorias',
            min: {
                value: 0,
                message: 'Las horas prácticas no pueden ser negativas'
            }
        }
    },
    horario: {
        dia: {
            required: 'El día es obligatorio'
        },
        horaInicio: {
            required: 'La hora de inicio es obligatoria'
        },
        horaFin: {
            required: 'La hora de fin es obligatoria'
        },
        aula: {
            required: 'El aula es obligatoria'
        },
        tipoClase: {
            required: 'El tipo de clase es obligatorio'
        }
    }
};

export const validateAsignaturaData = (data) => {
    const errors = {};

    // Validar código
    if (!data.codigo) {
        errors.codigo = 'El código es obligatorio';
    } else if (!/^[A-Za-z0-9]{3,10}$/.test(data.codigo)) {
        errors.codigo = 'El código debe tener entre 3 y 10 caracteres alfanuméricos';
    }

    // Validar nombre
    if (!data.nombre) {
        errors.nombre = 'El nombre es obligatorio';
    } else if (data.nombre.length < 3) {
        errors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar créditos
    if (!data.creditos) {
        errors.creditos = 'Los créditos son obligatorios';
    } else if (data.creditos < 1 || data.creditos > 10) {
        errors.creditos = 'Los créditos deben estar entre 1 y 10';
    }

    // Validar consistencia de horas
    const totalHoras = (data.horasTeoricas || 0) + (data.horasPracticas || 0);
    const expectedHours = (data.creditos || 0) * 16;
    if (totalHoras !== expectedHours) {
        errors.horasConsistency = 'Las horas totales deben ser igual a créditos × 16';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateHorarioData = (data) => {
    const errors = {};

    if (!data.dia) errors.dia = 'El día es obligatorio';
    if (!data.horaInicio) errors.horaInicio = 'La hora de inicio es obligatoria';
    if (!data.horaFin) errors.horaFin = 'La hora de fin es obligatoria';
    if (!data.aula) errors.aula = 'El aula es obligatoria';
    if (!data.tipoClase) errors.tipoClase = 'El tipo de clase es obligatorio';

    // Validar que hora fin sea posterior a hora inicio
    if (data.horaInicio && data.horaFin && data.horaInicio >= data.horaFin) {
        errors.horaFin = 'La hora de fin debe ser posterior a la hora de inicio';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};