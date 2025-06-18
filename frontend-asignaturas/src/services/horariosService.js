import { apiRequest, handleApiResponse, handleApiError, buildQueryParams } from './api';

const ENDPOINTS = {
    HORARIOS: '/horarios',
    VALIDAR_CONFLICTOS: '/horarios/validar-conflictos',
    POR_DIA: '/horarios/dia',
    POR_AULA: '/horarios/aula',
    POR_PROFESOR: '/horarios/profesor',
    POR_ASIGNATURA: '/horarios/asignatura',
    DISPONIBILIDAD: '/horarios/disponibilidad',
    EXPORT: '/horarios/export'
};

export const horariosService = {
    // Obtener todos los horarios
    getAll: async (filters = {}) => {
        try {
            const queryParams = buildQueryParams(filters);
            const url = queryParams ? `${ENDPOINTS.HORARIOS}?${queryParams}` : ENDPOINTS.HORARIOS;
            const response = await apiRequest.get(url);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Obtener horario por ID
    getById: async (id) => {
        try {
            const response = await apiRequest.get(`${ENDPOINTS.HORARIOS}/${id}`);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Crear nuevo horario
    create: async (horarioData) => {
        try {
            const response = await apiRequest.post(ENDPOINTS.HORARIOS, horarioData);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Actualizar horario
    update: async (id, horarioData) => {
        try {
            const response = await apiRequest.put(`${ENDPOINTS.HORARIOS}/${id}`, horarioData);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Eliminar horario
    delete: async (id) => {
        try {
            const response = await apiRequest.delete(`${ENDPOINTS.HORARIOS}/${id}`);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Obtener horarios por día
    getByDay: async (dia) => {
        try {
            const response = await apiRequest.get(`${ENDPOINTS.POR_DIA}/${dia}`);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Obtener horarios por aula
    getByClassroom: async (aulaId) => {
        try {
            const response = await apiRequest.get(`${ENDPOINTS.POR_AULA}/${aulaId}`);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Obtener horarios por profesor
    getByProfessor: async (profesorId) => {
        try {
            const response = await apiRequest.get(`${ENDPOINTS.POR_PROFESOR}/${profesorId}`);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Obtener horarios por asignatura
    getBySubject: async (asignaturaId) => {
        try {
            const response = await apiRequest.get(`${ENDPOINTS.POR_ASIGNATURA}/${asignaturaId}`);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Validar conflictos de horario
    validateConflicts: async (horarioData) => {
        try {
            const response = await apiRequest.post(ENDPOINTS.VALIDAR_CONFLICTOS, horarioData);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Verificar disponibilidad de aula
    checkAvailability: async (aulaId, dia, horaInicio, horaFin) => {
        try {
            const queryParams = buildQueryParams({ aulaId, dia, horaInicio, horaFin });
            const response = await apiRequest.get(`${ENDPOINTS.DISPONIBILIDAD}?${queryParams}`);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Obtener horario semanal
    getWeeklySchedule: async (filters = {}) => {
        try {
            const queryParams = buildQueryParams(filters);
            const response = await apiRequest.get(`${ENDPOINTS.HORARIOS}/semanal?${queryParams}`);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Exportar horarios
    export: async (format = 'pdf', filters = {}) => {
        try {
            const queryParams = buildQueryParams({ format, ...filters });
            const response = await apiRequest.get(`${ENDPOINTS.EXPORT}?${queryParams}`, {
                responseType: format === 'pdf' ? 'blob' : 'json'
            });
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Duplicar horario
    duplicate: async (horarioId) => {
        try {
            const response = await apiRequest.post(`${ENDPOINTS.HORARIOS}/${horarioId}/duplicar`);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Intercambiar horarios
    swap: async (horarioId1, horarioId2) => {
        try {
            const response = await apiRequest.post(`${ENDPOINTS.HORARIOS}/intercambiar`, {
                horarioId1,
                horarioId2
            });
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Generar horarios automáticamente
    generateAutomatic: async (criterios) => {
        try {
            const response = await apiRequest.post(`${ENDPOINTS.HORARIOS}/generar-automatico`, criterios);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    }
};

export default horariosService;