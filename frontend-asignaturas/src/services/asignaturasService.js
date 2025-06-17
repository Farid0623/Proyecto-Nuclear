import { apiRequest, handleApiResponse, handleApiError, buildQueryParams } from './api';

const ENDPOINTS = {
    ASIGNATURAS: '/asignaturas',
    VALIDAR: '/asignaturas/validar',
    ESTADISTICAS: '/asignaturas/estadisticas',
    BUSCAR: '/asignaturas/buscar',
    ACTIVAS: '/asignaturas/activas',
    POR_CREDITOS: '/asignaturas/creditos',
    CAMBIAR_ESTADO: '/asignaturas/{id}/estado',
    POR_CODIGO: '/asignaturas/codigo/{codigo}',
};

export const asignaturasService = {
    // Obtener todas las asignaturas
    getAll: async (filters = {}) => {
        try {
            const queryParams = buildQueryParams(filters);
            const url = queryParams ? `${ENDPOINTS.ASIGNATURAS}?${queryParams}` : ENDPOINTS.ASIGNATURAS;
            const response = await apiRequest.get(url);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Obtener asignatura por ID
    getById: async (id) => {
        try {
            const response = await apiRequest.get(`${ENDPOINTS.ASIGNATURAS}/${id}`);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Obtener asignatura por código
    getByCodigo: async (codigo) => {
        try {
            const url = ENDPOINTS.POR_CODIGO.replace('{codigo}', codigo);
            const response = await apiRequest.get(url);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Crear nueva asignatura
    create: async (asignaturaData) => {
        try {
            const response = await apiRequest.post(ENDPOINTS.ASIGNATURAS, asignaturaData);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Actualizar asignatura
    update: async (id, asignaturaData) => {
        try {
            const response = await apiRequest.put(`${ENDPOINTS.ASIGNATURAS}/${id}`, asignaturaData);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Eliminar asignatura
    delete: async (id) => {
        try {
            const response = await apiRequest.delete(`${ENDPOINTS.ASIGNATURAS}/${id}`);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Buscar asignaturas por nombre
    searchByName: async (nombre) => {
        try {
            const queryParams = buildQueryParams({ nombre });
            const response = await apiRequest.get(`${ENDPOINTS.BUSCAR}?${queryParams}`);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Obtener asignaturas activas
    getActive: async () => {
        try {
            const response = await apiRequest.get(ENDPOINTS.ACTIVAS);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Obtener asignaturas por créditos
    getByCredits: async (creditos) => {
        try {
            const response = await apiRequest.get(`${ENDPOINTS.POR_CREDITOS}/${creditos}`);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Cambiar estado de asignatura (activa/inactiva)
    changeStatus: async (id, activa) => {
        try {
            const url = ENDPOINTS.CAMBIAR_ESTADO.replace('{id}', id);
            const queryParams = buildQueryParams({ activa });
            const response = await apiRequest.patch(`${url}?${queryParams}`);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Validar datos de asignatura
    validate: async (asignaturaData) => {
        try {
            const response = await apiRequest.post(ENDPOINTS.VALIDAR, asignaturaData);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Obtener estadísticas
    getStatistics: async () => {
        try {
            const response = await apiRequest.get(ENDPOINTS.ESTADISTICAS);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Filtrar asignaturas avanzado
    filter: async (filters) => {
        try {
            const queryParams = buildQueryParams(filters);
            const response = await apiRequest.get(`${ENDPOINTS.ASIGNATURAS}?${queryParams}`);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Verificar si existe código
    checkCodeExists: async (codigo, excludeId = null) => {
        try {
            const filters = { codigo };
            if (excludeId) {
                filters.excludeId = excludeId;
            }
            const asignaturas = await asignaturasService.getAll(filters);
            return asignaturas.length > 0;
        } catch (error) {
            return false;
        }
    },

    // Obtener asignaturas con paginación
    getPaginated: async (page = 1, limit = 10, filters = {}) => {
        try {
            const queryParams = buildQueryParams({
                page,
                limit,
                ...filters
            });
            const response = await apiRequest.get(`${ENDPOINTS.ASIGNATURAS}?${queryParams}`);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Buscar asignaturas por múltiples criterios
    search: async (searchCriteria) => {
        try {
            const queryParams = buildQueryParams(searchCriteria);
            const response = await apiRequest.get(`${ENDPOINTS.BUSCAR}?${queryParams}`);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Bulk operations
    bulkUpdate: async (asignaturasData) => {
        try {
            const response = await apiRequest.put(`${ENDPOINTS.ASIGNATURAS}/bulk`, asignaturasData);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    bulkDelete: async (ids) => {
        try {
            const response = await apiRequest.delete(`${ENDPOINTS.ASIGNATURAS}/bulk`, { data: { ids } });
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Exportar asignaturas
    export: async (format = 'json', filters = {}) => {
        try {
            const queryParams = buildQueryParams({ format, ...filters });
            const response = await apiRequest.get(`${ENDPOINTS.ASIGNATURAS}/export?${queryParams}`, {
                responseType: format === 'pdf' ? 'blob' : 'json'
            });
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Importar asignaturas
    import: async (file, format = 'json') => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('format', format);

            const response = await apiRequest.post(`${ENDPOINTS.ASIGNATURAS}/import`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },
};

export default asignaturasService;