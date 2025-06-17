// src/services/pensumService.js - Servicio completo para gestión de pensum
import { apiHelper, buildQueryParams } from '../config/api';

const ENDPOINTS = {
    PENSUM: '/pensum',
    PLANES_ESTUDIO: '/planes-estudio',
    SEMESTRES: '/semestres',
    MALLA_CURRICULAR: '/malla-curricular',
    PRERREQUISITOS: '/prerrequisitos',
    VALIDACION: '/pensum/validar',
    ESTADISTICAS: '/pensum/estadisticas',
    EXPORT: '/pensum/export',
    IMPORT: '/pensum/import',
    CLONAR: '/pensum/clonar'
};

export const pensumService = {
    // ==================== PLANES DE ESTUDIO ====================

    // Obtener todos los planes de estudio
    getPlanesEstudio: async (filters = {}) => {
        try {
            const queryParams = buildQueryParams(filters);
            const url = queryParams ? `${ENDPOINTS.PLANES_ESTUDIO}?${queryParams}` : ENDPOINTS.PLANES_ESTUDIO;
            const response = await apiHelper.get(url);
            return response.data;
        } catch (error) {
            throw new Error(`Error obteniendo planes de estudio: ${error.message}`);
        }
    },

    // Obtener plan de estudio por ID
    getPlanEstudio: async (id) => {
        try {
            const response = await apiHelper.get(`${ENDPOINTS.PLANES_ESTUDIO}/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error obteniendo plan de estudio: ${error.message}`);
        }
    },

    // Crear nuevo plan de estudio
    createPlanEstudio: async (planData) => {
        try {
            const response = await apiHelper.post(ENDPOINTS.PLANES_ESTUDIO, planData);
            return response.data;
        } catch (error) {
            throw new Error(`Error creando plan de estudio: ${error.message}`);
        }
    },

    // Actualizar plan de estudio
    updatePlanEstudio: async (id, planData) => {
        try {
            const response = await apiHelper.put(`${ENDPOINTS.PLANES_ESTUDIO}/${id}`, planData);
            return response.data;
        } catch (error) {
            throw new Error(`Error actualizando plan de estudio: ${error.message}`);
        }
    },

    // Eliminar plan de estudio
    deletePlanEstudio: async (id) => {
        try {
            const response = await apiHelper.delete(`${ENDPOINTS.PLANES_ESTUDIO}/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error eliminando plan de estudio: ${error.message}`);
        }
    },

    // ==================== MALLA CURRICULAR ====================

    // Obtener malla curricular completa
    getMallaCurricular: async (planId) => {
        try {
            const response = await apiHelper.get(`${ENDPOINTS.MALLA_CURRICULAR}/${planId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error obteniendo malla curricular: ${error.message}`);
        }
    },

    // Actualizar malla curricular completa
    updateMallaCurricular: async (planId, mallaData) => {
        try {
            const response = await apiHelper.put(`${ENDPOINTS.MALLA_CURRICULAR}/${planId}`, mallaData);
            return response.data;
        } catch (error) {
            throw new Error(`Error actualizando malla curricular: ${error.message}`);
        }
    },

    // ==================== SEMESTRES ====================

    // Obtener semestres de un plan
    getSemestres: async (planId) => {
        try {
            const response = await apiHelper.get(`${ENDPOINTS.PLANES_ESTUDIO}/${planId}/semestres`);
            return response.data;
        } catch (error) {
            throw new Error(`Error obteniendo semestres: ${error.message}`);
        }
    },

    // Obtener semestre específico
    getSemestre: async (planId, semestreNumero) => {
        try {
            const response = await apiHelper.get(`${ENDPOINTS.PLANES_ESTUDIO}/${planId}/semestres/${semestreNumero}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error obteniendo semestre: ${error.message}`);
        }
    },

    // Actualizar semestre
    updateSemestre: async (planId, semestreNumero, semestreData) => {
        try {
            const response = await apiHelper.put(
                `${ENDPOINTS.PLANES_ESTUDIO}/${planId}/semestres/${semestreNumero}`,
                semestreData
            );
            return response.data;
        } catch (error) {
            throw new Error(`Error actualizando semestre: ${error.message}`);
        }
    },

    // Agregar asignatura a semestre
    addAsignaturaToSemestre: async (planId, semestreNumero, asignaturaId) => {
        try {
            const response = await apiHelper.post(
                `${ENDPOINTS.PLANES_ESTUDIO}/${planId}/semestres/${semestreNumero}/asignaturas`,
                { asignaturaId }
            );
            return response.data;
        } catch (error) {
            throw new Error(`Error agregando asignatura al semestre: ${error.message}`);
        }
    },

    // Remover asignatura de semestre
    removeAsignaturaFromSemestre: async (planId, semestreNumero, asignaturaId) => {
        try {
            const response = await apiHelper.delete(
                `${ENDPOINTS.PLANES_ESTUDIO}/${planId}/semestres/${semestreNumero}/asignaturas/${asignaturaId}`
            );
            return response.data;
        } catch (error) {
            throw new Error(`Error removiendo asignatura del semestre: ${error.message}`);
        }
    },

    // Mover asignatura entre semestres
    moveAsignaturaBetweenSemestres: async (planId, fromSemestre, toSemestre, asignaturaId) => {
        try {
            const response = await apiHelper.post(
                `${ENDPOINTS.PLANES_ESTUDIO}/${planId}/mover-asignatura`,
                {
                    asignaturaId,
                    fromSemestre,
                    toSemestre
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(`Error moviendo asignatura: ${error.message}`);
        }
    },

    // ==================== PRERREQUISITOS ====================

    // Obtener prerrequisitos de una asignatura
    getPrerrequisitos: async (asignaturaId) => {
        try {
            const response = await apiHelper.get(`${ENDPOINTS.PRERREQUISITOS}/${asignaturaId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error obteniendo prerrequisitos: ${error.message}`);
        }
    },

    // Establecer prerrequisitos
    setPrerrequisitos: async (asignaturaId, prerrequisitos) => {
        try {
            const response = await apiHelper.post(`${ENDPOINTS.PRERREQUISITOS}/${asignaturaId}`, {
                prerrequisitos
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error estableciendo prerrequisitos: ${error.message}`);
        }
    },

    // Agregar prerrequisito
    addPrerrequisito: async (asignaturaId, prerrequisitId) => {
        try {
            const response = await apiHelper.post(
                `${ENDPOINTS.PRERREQUISITOS}/${asignaturaId}/add`,
                { prerrequisitId }
            );
            return response.data;
        } catch (error) {
            throw new Error(`Error agregando prerrequisito: ${error.message}`);
        }
    },

    // Remover prerrequisito
    removePrerrequisito: async (asignaturaId, prerrequisitId) => {
        try {
            const response = await apiHelper.delete(
                `${ENDPOINTS.PRERREQUISITOS}/${asignaturaId}/${prerrequisitId}`
            );
            return response.data;
        } catch (error) {
            throw new Error(`Error removiendo prerrequisito: ${error.message}`);
        }
    },

    // Obtener árbol de dependencias
    getArbolDependencias: async (planId) => {
        try {
            const response = await apiHelper.get(`${ENDPOINTS.PLANES_ESTUDIO}/${planId}/dependencias`);
            return response.data;
        } catch (error) {
            throw new Error(`Error obteniendo árbol de dependencias: ${error.message}`);
        }
    },

    // ==================== VALIDACIONES ====================

    // Validar plan de estudios completo
    validatePlanEstudio: async (planId) => {
        try {
            const response = await apiHelper.post(`${ENDPOINTS.VALIDACION}/${planId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error validando plan de estudios: ${error.message}`);
        }
    },

    // Validar semestre específico
    validateSemestre: async (planId, semestreNumero) => {
        try {
            const response = await apiHelper.post(
                `${ENDPOINTS.VALIDACION}/${planId}/semestre/${semestreNumero}`
            );
            return response.data;
        } catch (error) {
            throw new Error(`Error validando semestre: ${error.message}`);
        }
    },

    // Validar prerrequisitos
    validatePrerrequisitos: async (planId) => {
        try {
            const response = await apiHelper.post(`${ENDPOINTS.VALIDACION}/${planId}/prerrequisitos`);
            return response.data;
        } catch (error) {
            throw new Error(`Error validando prerrequisitos: ${error.message}`);
        }
    },

    // Detectar dependencias circulares
    detectCircularDependencies: async (planId) => {
        try {
            const response = await apiHelper.get(`${ENDPOINTS.VALIDACION}/${planId}/circular-dependencies`);
            return response.data;
        } catch (error) {
            throw new Error(`Error detectando dependencias circulares: ${error.message}`);
        }
    },

    // ==================== ESTADÍSTICAS ====================

    // Obtener estadísticas del pensum
    getEstadisticas: async (planId) => {
        try {
            const response = await apiHelper.get(`${ENDPOINTS.ESTADISTICAS}/${planId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error obteniendo estadísticas: ${error.message}`);
        }
    },

    // Obtener estadísticas por semestre
    getEstadisticasSemestre: async (planId, semestreNumero) => {
        try {
            const response = await apiHelper.get(`${ENDPOINTS.ESTADISTICAS}/${planId}/semestre/${semestreNumero}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error obteniendo estadísticas del semestre: ${error.message}`);
        }
    },

    // Obtener métricas generales de todos los planes
    getMetricasGenerales: async () => {
        try {
            const response = await apiHelper.get(`${ENDPOINTS.ESTADISTICAS}/general`);
            return response.data;
        } catch (error) {
            throw new Error(`Error obteniendo métricas generales: ${error.message}`);
        }
    },

    // ==================== IMPORT/EXPORT ====================

    // Exportar plan de estudios
    exportPlanEstudio: async (planId, format = 'json') => {
        try {
            const queryParams = buildQueryParams({ format });
            const response = await apiHelper.get(
                `${ENDPOINTS.EXPORT}/${planId}?${queryParams}`,
                {
                    responseType: format === 'pdf' ? 'blob' : 'json'
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(`Error exportando plan de estudios: ${error.message}`);
        }
    },

    // Importar plan de estudios
    importPlanEstudio: async (file, options = {}) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            Object.entries(options).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const response = await apiHelper.post(ENDPOINTS.IMPORT, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error importando plan de estudios: ${error.message}`);
        }
    },

    // ==================== UTILIDADES ====================

    // Clonar plan de estudios
    clonarPlanEstudio: async (planId, newPlanData) => {
        try {
            const response = await apiHelper.post(`${ENDPOINTS.CLONAR}/${planId}`, newPlanData);
            return response.data;
        } catch (error) {
            throw new Error(`Error clonando plan de estudios: ${error.message}`);
        }
    },

    // Obtener template de plan de estudios
    getTemplatePlan: async (programaId) => {
        try {
            const response = await apiHelper.get(`${ENDPOINTS.PLANES_ESTUDIO}/template/${programaId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Error obteniendo template: ${error.message}`);
        }
    },

    // Obtener asignaturas disponibles para agregar al plan
    getAsignaturasDisponibles: async (planId, semestreNumero = null) => {
        try {
            const queryParams = semestreNumero ? buildQueryParams({ semestre: semestreNumero }) : '';
            const url = `${ENDPOINTS.PLANES_ESTUDIO}/${planId}/asignaturas-disponibles${queryParams ? `?${queryParams}` : ''}`;
            const response = await apiHelper.get(url);
            return response.data;
        } catch (error) {
            throw new Error(`Error obteniendo asignaturas disponibles: ${error.message}`);
        }
    },

    // Verificar conflictos al mover asignatura
    checkConflictos: async (planId, asignaturaId, newSemestre) => {
        try {
            const response = await apiHelper.post(`${ENDPOINTS.VALIDACION}/${planId}/check-conflictos`, {
                asignaturaId,
                newSemestre
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error verificando conflictos: ${error.message}`);
        }
    },

    // Generar reporte de cumplimiento
    generateReporteCumplimiento: async (planId) => {
        try {
            const response = await apiHelper.get(`${ENDPOINTS.PLANES_ESTUDIO}/${planId}/reporte-cumplimiento`);
            return response.data;
        } catch (error) {
            throw new Error(`Error generando reporte de cumplimiento: ${error.message}`);
        }
    },

    // ==================== OPERACIONES BATCH ====================

    // Actualización masiva de semestres
    batchUpdateSemestres: async (planId, semestresData) => {
        try {
            const response = await apiHelper.put(`${ENDPOINTS.PLANES_ESTUDIO}/${planId}/semestres/batch`, {
                semestres: semestresData
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error en actualización masiva de semestres: ${error.message}`);
        }
    },

    // Establecer múltiples prerrequisitos
    batchSetPrerrequisitos: async (prerrequisitosData) => {
        try {
            const response = await apiHelper.post(`${ENDPOINTS.PRERREQUISITOS}/batch`, {
                prerrequisitos: prerrequisitosData
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error estableciendo prerrequisitos masivos: ${error.message}`);
        }
    }
};

export default pensumService;