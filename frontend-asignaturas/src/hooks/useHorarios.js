// src/hooks/useHorarios.js
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import horariosService from '../services/horariosService';

// Keys para React Query
export const HORARIOS_QUERY_KEYS = {
    HORARIOS: 'horarios',
    HORARIO: 'horario',
    HORARIOS_DIA: 'horarios-dia',
    HORARIOS_AULA: 'horarios-aula',
    HORARIOS_PROFESOR: 'horarios-profesor',
    HORARIOS_ASIGNATURA: 'horarios-asignatura',
    HORARIOS_SEMANAL: 'horarios-semanal',
    DISPONIBILIDAD: 'disponibilidad'
};

// Hook para obtener todos los horarios
export const useHorarios = (filters = {}) => {
    return useQuery(
        [HORARIOS_QUERY_KEYS.HORARIOS, filters],
        () => horariosService.getAll(filters),
        {
            staleTime: 2 * 60 * 1000, // 2 minutos
            cacheTime: 5 * 60 * 1000, // 5 minutos
            retry: 3,
            refetchOnWindowFocus: false,
        }
    );
};

// Hook para obtener un horario específico
export const useHorario = (id) => {
    return useQuery(
        [HORARIOS_QUERY_KEYS.HORARIO, id],
        () => horariosService.getById(id),
        {
            enabled: !!id,
            staleTime: 5 * 60 * 1000,
            retry: 3,
        }
    );
};

// Hook para crear horario
export const useCreateHorario = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation(
        (horarioData) => horariosService.create(horarioData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries([HORARIOS_QUERY_KEYS.HORARIOS]);
                queryClient.invalidateQueries([HORARIOS_QUERY_KEYS.HORARIOS_SEMANAL]);
                toast.success(t('common.messages.saved'));
            },
            onError: (error) => {
                console.error('Error creando horario:', error);
                toast.error(error.response?.data?.message || t('common.messages.error'));
            },
        }
    );
};

// Hook para actualizar horario
export const useUpdateHorario = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation(
        ({ id, data }) => horariosService.update(id, data),
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([HORARIOS_QUERY_KEYS.HORARIOS]);
                queryClient.invalidateQueries([HORARIOS_QUERY_KEYS.HORARIO, variables.id]);
                queryClient.invalidateQueries([HORARIOS_QUERY_KEYS.HORARIOS_SEMANAL]);
                toast.success(t('common.messages.updated'));
            },
            onError: (error) => {
                console.error('Error actualizando horario:', error);
                toast.error(error.response?.data?.message || t('common.messages.error'));
            },
        }
    );
};

// Hook para eliminar horario
export const useDeleteHorario = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation(
        (id) => horariosService.delete(id),
        {
            onSuccess: () => {
                queryClient.invalidateQueries([HORARIOS_QUERY_KEYS.HORARIOS]);
                queryClient.invalidateQueries([HORARIOS_QUERY_KEYS.HORARIOS_SEMANAL]);
                toast.success(t('common.messages.deleted'));
            },
            onError: (error) => {
                console.error('Error eliminando horario:', error);
                toast.error(error.response?.data?.message || t('common.messages.error'));
            },
        }
    );
};

// Hook para obtener horarios por día
export const useHorariosByDay = (dia) => {
    return useQuery(
        [HORARIOS_QUERY_KEYS.HORARIOS_DIA, dia],
        () => horariosService.getByDay(dia),
        {
            enabled: !!dia,
            staleTime: 2 * 60 * 1000,
            retry: 3,
        }
    );
};

// Hook para obtener horarios por aula
export const useHorariosByClassroom = (aulaId) => {
    return useQuery(
        [HORARIOS_QUERY_KEYS.HORARIOS_AULA, aulaId],
        () => horariosService.getByClassroom(aulaId),
        {
            enabled: !!aulaId,
            staleTime: 2 * 60 * 1000,
            retry: 3,
        }
    );
};

// Hook para obtener horario semanal
export const useWeeklySchedule = (filters = {}) => {
    return useQuery(
        [HORARIOS_QUERY_KEYS.HORARIOS_SEMANAL, filters],
        () => horariosService.getWeeklySchedule(filters),
        {
            staleTime: 5 * 60 * 1000,
            retry: 3,
            refetchOnWindowFocus: false,
        }
    );
};

// Hook para validar conflictos
export const useValidateConflicts = () => {
    return useMutation(
        (horarioData) => horariosService.validateConflicts(horarioData),
        {
            onError: (error) => {
                console.error('Error validando conflictos:', error);
            },
        }
    );
};

// Hook para verificar disponibilidad
export const useCheckAvailability = () => {
    return useMutation(
        ({ aulaId, dia, horaInicio, horaFin }) =>
            horariosService.checkAvailability(aulaId, dia, horaInicio, horaFin),
        {
            onError: (error) => {
                console.error('Error verificando disponibilidad:', error);
            },
        }
    );
};

// Hook para duplicar horario
export const useDuplicateHorario = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation(
        (horarioId) => horariosService.duplicate(horarioId),
        {
            onSuccess: () => {
                queryClient.invalidateQueries([HORARIOS_QUERY_KEYS.HORARIOS]);
                toast.success('Horario duplicado exitosamente');
            },
            onError: (error) => {
                console.error('Error duplicando horario:', error);
                toast.error(error.response?.data?.message || t('common.messages.error'));
            },
        }
    );
};

// Hook para intercambiar horarios
export const useSwapHorarios = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation(
        ({ horarioId1, horarioId2 }) => horariosService.swap(horarioId1, horarioId2),
        {
            onSuccess: () => {
                queryClient.invalidateQueries([HORARIOS_QUERY_KEYS.HORARIOS]);
                queryClient.invalidateQueries([HORARIOS_QUERY_KEYS.HORARIOS_SEMANAL]);
                toast.success('Horarios intercambiados exitosamente');
            },
            onError: (error) => {
                console.error('Error intercambiando horarios:', error);
                toast.error(error.response?.data?.message || t('common.messages.error'));
            },
        }
    );
};