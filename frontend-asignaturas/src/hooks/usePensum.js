// src/hooks/usePensum.js - Hooks completos para gestión de pensum
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import pensumService from '../services/pensumService';

// Keys para React Query
export const PENSUM_QUERY_KEYS = {
    PLANES_ESTUDIO: 'planes-estudio',
    PLAN_ESTUDIO: 'plan-estudio',
    MALLA_CURRICULAR: 'malla-curricular',
    SEMESTRES: 'semestres',
    SEMESTRE: 'semestre',
    PRERREQUISITOS: 'prerrequisitos',
    ESTADISTICAS: 'pensum-estadisticas',
    VALIDACION: 'pensum-validacion',
    ASIGNATURAS_DISPONIBLES: 'asignaturas-disponibles'
};

// ==================== PLANES DE ESTUDIO ====================

// Hook para obtener todos los planes de estudio
export const usePlanesEstudio = (filters = {}) => {
    return useQuery(
        [PENSUM_QUERY_KEYS.PLANES_ESTUDIO, filters],
        () => pensumService.getPlanesEstudio(filters),
        {
            staleTime: 5 * 60 * 1000, // 5 minutos
            cacheTime: 10 * 60 * 1000, // 10 minutos
            retry: 3,
            refetchOnWindowFocus: false,
        }
    );
};

// Hook para obtener un plan de estudios específico
export const usePlanEstudio = (planId) => {
    return useQuery(
        [PENSUM_QUERY_KEYS.PLAN_ESTUDIO, planId],
        () => pensumService.getPlanEstudio(planId),
        {
            enabled: !!planId,
            staleTime: 5 * 60 * 1000,
            retry: 3,
        }
    );
};

// Hook para crear plan de estudios
export const useCreatePlanEstudio = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation(
        (planData) => pensumService.createPlanEstudio(planData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries([PENSUM_QUERY_KEYS.PLANES_ESTUDIO]);
                toast.success('Plan de estudios creado exitosamente');
            },
            onError: (error) => {
                console.error('Error creando plan de estudios:', error);
                toast.error(error.message || 'Error creando plan de estudios');
            },
        }
    );
};

// Hook para actualizar plan de estudios
export const useUpdatePlanEstudio = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation(
        ({ id, data }) => pensumService.updatePlanEstudio(id, data),
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([PENSUM_QUERY_KEYS.PLANES_ESTUDIO]);
                queryClient.invalidateQueries([PENSUM_QUERY_KEYS.PLAN_ESTUDIO, variables.id]);
                toast.success('Plan de estudios actualizado exitosamente');
            },
            onError: (error) => {
                console.error('Error actualizando plan de estudios:', error);
                toast.error(error.message || 'Error actualizando plan de estudios');
            },
        }
    );
};

// Hook para eliminar plan de estudios
export const useDeletePlanEstudio = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation(
        (planId) => pensumService.deletePlanEstudio(planId),
        {
            onSuccess: () => {
                queryClient.invalidateQueries([PENSUM_QUERY_KEYS.PLANES_ESTUDIO]);
                toast.success('Plan de estudios eliminado exitosamente');
            },
            onError: (error) => {
                console.error('Error eliminando plan de estudios:', error);
                toast.error(error.message || 'Error eliminando plan de estudios');
            },
        }
    );
};

// ==================== MALLA CURRICULAR ====================

// Hook para obtener malla curricular
export const useMallaCurricular = (planId) => {
    return useQuery(
        [PENSUM_QUERY_KEYS.MALLA_CURRICULAR, planId],
        () => pensumService.getMallaCurricular(planId),
        {
            enabled: !!planId,
            staleTime: 2 * 60 * 1000, // 2 minutos
            retry: 3,
        }
    );
};

// Hook para actualizar malla curricular
export const useUpdateMallaCurricular = () => {
    const queryClient = useQueryClient();

    return useMutation(
        ({ planId, mallaData }) => pensumService.updateMallaCurricular(planId, mallaData),
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([PENSUM_QUERY_KEYS.MALLA_CURRICULAR, variables.planId]);
                queryClient.invalidateQueries([PENSUM_QUERY_KEYS.SEMESTRES, variables.planId]);
                toast.success('Malla curricular actualizada exitosamente');
            },
            onError: (error) => {
                console.error('Error actualizando malla curricular:', error);
                toast.error(error.message || 'Error actualizando malla curricular');
            },
        }
    );
};

// ==================== SEMESTRES ====================

// Hook para obtener semestres de un plan
export const useSemestres = (planId) => {
    return useQuery(
        [PENSUM_QUERY_KEYS.SEMESTRES, planId],
        () => pensumService.getSemestres(planId),
        {
            enabled: !!planId,
            staleTime: 2 * 60 * 1000,
            retry: 3,
        }
    );
};

// Hook para obtener un semestre específico
export const useSemestre = (planId, semestreNumero) => {
    return useQuery(
        [PENSUM_QUERY_KEYS.SEMESTRE, planId, semestreNumero],
        () => pensumService.getSemestre(planId, semestreNumero),
        {
            enabled: !!planId && !!semestreNumero,
            staleTime: 2 * 60 * 1000,
            retry: 3,
        }
    );
};

// Hook para actualizar semestre
export const useUpdateSemestre = () => {
    const queryClient = useQueryClient();

    return useMutation(
        ({ planId, semestreNumero, semestreData }) =>
            pensumService.updateSemestre(planId, semestreNumero, semestreData),
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([PENSUM_QUERY_KEYS.SEMESTRES, variables.planId]);
                queryClient.invalidateQueries([PENSUM_QUERY_KEYS.SEMESTRE, variables.planId, variables.semestreNumero]);
                queryClient.invalidateQueries([PENSUM_QUERY_KEYS.MALLA_CURRICULAR, variables.planId]);
                toast.success('Semestre actualizado exitosamente');
            },
            onError: (error) => {
                console.error('Error actualizando semestre:', error);
                toast.error(error.message || 'Error actualizando semestre');
            },
        }
    );
};

// ==================== GESTIÓN DE ASIGNATURAS EN SEMESTRES ====================

// Hook para agregar asignatura a semestre
export const useAddAsignaturaToSemestre = () => {
    const queryClient = useQueryClient();

    return useMutation(
        ({ planId, semestreNumero, asignaturaId }) =>
            pensumService.addAsignaturaToSemestre(planId, semestreNumero, asignaturaId),
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([PENSUM_QUERY_KEYS.SEMESTRES, variables.planId]);
                queryClient.invalidateQueries([PENSUM_QUERY_KEYS.SEMESTRE, variables.planId, variables.semestreNumero]);
                queryClient.invalidateQueries([PENSUM_QUERY_KEYS.MALLA_CURRICULAR, variables.planId]);
                queryClient.invalidateQueries([PENSUM_QUERY_KEYS.ASIGNATURAS_DISPONIBLES, variables.planId]);
                toast.success('Asignatura agregada al semestre');
            },
            onError: (error) => {
                console.error('Error agregando asignatura:', error);
                toast.error(error.message || 'Error agregando asignatura al semestre');
            },
        }
    );
};

// Hook para remover asignatura de semestre
export const useRemoveAsignaturaFromSemestre = () => {
    const queryClient = useQueryClient();

    return useMutation(
        ({ planId, semestreNumero, asignaturaId }) =>
            pensumService.removeAsignaturaFromSemestre(planId, semestreNumero, asignaturaId),
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([PENSUM_QUERY_KEYS.SEMESTRES, variables.planId]);
                queryClient.invalidateQueries([PENSUM_QUERY_KEYS.SEMESTRE, variables.planId, variables.semestreNumero]);
                queryClient.invalidateQueries([PENSUM_QUERY_KEYS.MALLA_CURRICULAR, variables.planId]);
                queryClient.invalidateQueries([PENSUM_QUERY_KEYS.ASIGNATURAS_DISPONIBLES, variables.planId]);
                toast.success('Asignatura removida del semestre');
            },
            onError: (error) => {
                console.error('Error removiendo asignatura:', error);
                toast.error(error.message || 'Error removiendo asignatura del semestre');
            },
        }
    );
};

// Hook para mover asignatura entre semestres
export const useMoveAsignaturaBetweenSemestres = () => {
    const queryClient = useQueryClient();

    return useMutation(
        ({ planId, fromSemestre, toSemestre, asignaturaId }) =>
            pensumService.moveAsignaturaBetweenSemestres(planId, fromSemestre, toSemestre, asignaturaId),
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([PENSUM_QUERY_KEYS.SEMESTRES, variables.planId]);
                queryClient.invalidateQueries([PENSUM_QUERY_KEYS.MALLA_CURRICULAR, variables.planId]);
                toast.success('Asignatura movida exitosamente');
            },
            onError: (error) => {
                console.error('Error moviendo asignatura:', error);
                toast.error(error.message || 'Error moviendo asignatura');
            },
        }
    );
};

// ==================== PRERREQUISITOS ====================

// Hook para obtener prerrequisitos
export const usePrerrequisitos = (asignaturaId) => {
    return useQuery(
        [PENSUM_QUERY_KEYS.PRERREQUISITOS, asignaturaId],
        () => pensumService.getPrerrequisitos(asignaturaId),
        {
            enabled: !!asignaturaId,
            staleTime: 5 * 60 * 1000,
            retry: 3,
        }
    );
};

// Hook para establecer prerrequisitos
export const useSetPrerrequisitos = () => {
    const queryClient = useQueryClient();

    return useMutation(
        ({ asignaturaId, prerrequisitos }) =>
            pensumService.setPrerrequisitos(asignaturaId, prerrequisitos),
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([PENSUM_QUERY_KEYS.PRERREQUISITOS, variables.asignaturaId]);
                toast.success('Prerrequisitos establecidos exitosamente');
            },
            onError: (error) => {
                console.error('Error estableciendo prerrequisitos:', error);
                toast.error(error.message || 'Error estableciendo prerrequisitos');
            },
        }
    );
};

// ==================== VALIDACIONES ====================

// Hook para validar plan de estudios
export const useValidatePlanEstudio = () => {
    return useMutation(
        (planId) => pensumService.validatePlanEstudio(planId),
        {
            onError: (error) => {
                console.error('Error validando plan:', error);
                toast.error(error.message || 'Error validando plan de estudios');
            },
        }
    );
};

// Hook para validar semestre
export const useValidateSemestre = () => {
    return useMutation(
        ({ planId, semestreNumero }) => pensumService.validateSemestre(planId, semestreNumero),
        {
            onError: (error) => {
                console.error('Error validando semestre:', error);
                toast.error(error.message || 'Error validando semestre');
            },
        }
    );
};

// Hook para detectar dependencias circulares
export const useDetectCircularDependencies = (planId) => {
    return useQuery(
        [PENSUM_QUERY_KEYS.VALIDACION, 'circular', planId],
        () => pensumService.detectCircularDependencies(planId),
        {
            enabled: !!planId,
            staleTime: 1 * 60 * 1000, // 1 minuto
            retry: 2,
        }
    );
};

// ==================== ESTADÍSTICAS ====================

// Hook para obtener estadísticas del pensum
export const useEstadisticasPensum = (planId) => {
    return useQuery(
        [PENSUM_QUERY_KEYS.ESTADISTICAS, planId],
        () => pensumService.getEstadisticas(planId),
        {
            enabled: !!planId,
            staleTime: 5 * 60 * 1000,
            retry: 3,
        }
    );
};

// ==================== UTILIDADES ====================

// Hook para obtener asignaturas disponibles
export const useAsignaturasDisponibles = (planId, semestreNumero = null) => {
    return useQuery(
        [PENSUM_QUERY_KEYS.ASIGNATURAS_DISPONIBLES, planId, semestreNumero],
        () => pensumService.getAsignaturasDisponibles(planId, semestreNumero),
        {
            enabled: !!planId,
            staleTime: 2 * 60 * 1000,
            retry: 3,
        }
    );
};

// Hook para clonar plan de estudios
export const useClonarPlanEstudio = () => {
    const queryClient = useQueryClient();

    return useMutation(
        ({ planId, newPlanData }) => pensumService.clonarPlanEstudio(planId, newPlanData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries([PENSUM_QUERY_KEYS.PLANES_ESTUDIO]);
                toast.success('Plan de estudios clonado exitosamente');
            },
            onError: (error) => {
                console.error('Error clonando plan:', error);
                toast.error(error.message || 'Error clonando plan de estudios');
            },
        }
    );
};

// Hook para verificar conflictos
export const useCheckConflictos = () => {
    return useMutation(
        ({ planId, asignaturaId, newSemestre }) =>
            pensumService.checkConflictos(planId, asignaturaId, newSemestre),
        {
            onError: (error) => {
                console.error('Error verificando conflictos:', error);
            },
        }
    );
};

// ==================== HOOKS COMPUESTOS ====================

// Hook para gestión completa de pensum
export const usePensumManager = (planId) => {
    const queryClient = useQueryClient();

    // Funciones para invalidar caches relacionados
    const invalidateAllPensumQueries = () => {
        queryClient.invalidateQueries([PENSUM_QUERY_KEYS.PLAN_ESTUDIO, planId]);
        queryClient.invalidateQueries([PENSUM_QUERY_KEYS.MALLA_CURRICULAR, planId]);
        queryClient.invalidateQueries([PENSUM_QUERY_KEYS.SEMESTRES, planId]);
        queryClient.invalidateQueries([PENSUM_QUERY_KEYS.ESTADISTICAS, planId]);
    };

    return {
        invalidateAllPensumQueries,
        // Otros métodos helper...
    };
};

export default {
    usePlanesEstudio,
    usePlanEstudio,
    useCreatePlanEstudio,
    useUpdatePlanEstudio,
    useDeletePlanEstudio,
    useMallaCurricular,
    useUpdateMallaCurricular,
    useSemestres,
    useSemestre,
    useUpdateSemestre,
    useAddAsignaturaToSemestre,
    useRemoveAsignaturaFromSemestre,
    useMoveAsignaturaBetweenSemestres,
    usePrerrequisitos,
    useSetPrerrequisitos,
    useValidatePlanEstudio,
    useValidateSemestre,
    useDetectCircularDependencies,
    useEstadisticasPensum,
    useAsignaturasDisponibles,
    useClonarPlanEstudio,
    useCheckConflictos,
    usePensumManager
};