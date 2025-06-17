import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { asignaturasService } from '../services/asignaturasService';

// Keys para React Query
export const QUERY_KEYS = {
    ASIGNATURAS: 'asignaturas',
    ASIGNATURA: 'asignatura',
    ASIGNATURAS_ACTIVAS: 'asignaturas-activas',
    ASIGNATURAS_ESTADISTICAS: 'asignaturas-estadisticas',
};

// Hook principal para obtener todas las asignaturas
export const useAsignaturas = (filters = {}) => {
    return useQuery(
        [QUERY_KEYS.ASIGNATURAS, filters],
        () => asignaturasService.getAll(filters),
        {
            staleTime: 5 * 60 * 1000, // 5 minutos
            cacheTime: 10 * 60 * 1000, // 10 minutos
            retry: 3,
            refetchOnWindowFocus: false,
        }
    );
};

// Hook para obtener una asignatura específica
export const useAsignatura = (id) => {
    return useQuery(
        [QUERY_KEYS.ASIGNATURA, id],
        () => asignaturasService.getById(id),
        {
            enabled: !!id,
            staleTime: 5 * 60 * 1000,
            retry: 3,
        }
    );
};

// Hook para obtener asignaturas activas
export const useAsignaturasActivas = () => {
    return useQuery(
        [QUERY_KEYS.ASIGNATURAS_ACTIVAS],
        () => asignaturasService.getActive(),
        {
            staleTime: 2 * 60 * 1000, // 2 minutos
            retry: 3,
        }
    );
};

// Hook para obtener estadísticas
export const useAsignaturasEstadisticas = () => {
    return useQuery(
        [QUERY_KEYS.ASIGNATURAS_ESTADISTICAS],
        () => asignaturasService.getStatistics(),
        {
            staleTime: 10 * 60 * 1000, // 10 minutos
            retry: 3,
        }
    );
};

// Hook para crear asignatura
export const useCreateAsignatura = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation(
        (asignaturaData) => asignaturasService.create(asignaturaData),
        {
            onSuccess: (data) => {
                // Invalidar queries relacionadas
                queryClient.invalidateQueries([QUERY_KEYS.ASIGNATURAS]);
                queryClient.invalidateQueries([QUERY_KEYS.ASIGNATURAS_ACTIVAS]);
                queryClient.invalidateQueries([QUERY_KEYS.ASIGNATURAS_ESTADISTICAS]);

                toast.success(t('common.messages.saved'));
            },
            onError: (error) => {
                console.error('Error creando asignatura:', error);
                toast.error(t('common.messages.error'));
            },
        }
    );
};

// Hook para actualizar asignatura
export const useUpdateAsignatura = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation(
        ({ id, data }) => asignaturasService.update(id, data),
        {
            onSuccess: (data, variables) => {
                // Invalidar queries relacionadas
                queryClient.invalidateQueries([QUERY_KEYS.ASIGNATURAS]);
                queryClient.invalidateQueries([QUERY_KEYS.ASIGNATURA, variables.id]);
                queryClient.invalidateQueries([QUERY_KEYS.ASIGNATURAS_ACTIVAS]);
                queryClient.invalidateQueries([QUERY_KEYS.ASIGNATURAS_ESTADISTICAS]);

                toast.success(t('common.messages.updated'));
            },
            onError: (error) => {
                console.error('Error actualizando asignatura:', error);
                toast.error(t('common.messages.error'));
            },
        }
    );
};

// Hook para eliminar asignatura
export const useDeleteAsignatura = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation(
        (id) => asignaturasService.delete(id),
        {
            onSuccess: () => {
                // Invalidar queries relacionadas
                queryClient.invalidateQueries([QUERY_KEYS.ASIGNATURAS]);
                queryClient.invalidateQueries([QUERY_KEYS.ASIGNATURAS_ACTIVAS]);
                queryClient.invalidateQueries([QUERY_KEYS.ASIGNATURAS_ESTADISTICAS]);

                toast.success(t('common.messages.deleted'));
            },
            onError: (error) => {
                console.error('Error eliminando asignatura:', error);
                toast.error(t('common.messages.error'));
            },
        }
    );
};

// Hook para cambiar estado de asignatura
export const useChangeAsignaturaStatus = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation(
        ({ id, activa }) => asignaturasService.changeStatus(id, activa),
        {
            onSuccess: (data, variables) => {
                // Invalidar queries relacionadas
                queryClient.invalidateQueries([QUERY_KEYS.ASIGNATURAS]);
                queryClient.invalidateQueries([QUERY_KEYS.ASIGNATURA, variables.id]);
                queryClient.invalidateQueries([QUERY_KEYS.ASIGNATURAS_ACTIVAS]);
                queryClient.invalidateQueries([QUERY_KEYS.ASIGNATURAS_ESTADISTICAS]);

                const message = variables.activa
                    ? 'Asignatura activada exitosamente'
                    : 'Asignatura desactivada exitosamente';
                toast.success(message);
            },
            onError: (error) => {
                console.error('Error cambiando estado:', error);
                toast.error(t('common.messages.error'));
            },
        }
    );
};

// Hook para búsqueda de asignaturas
export const useSearchAsignaturas = (searchTerm, options = {}) => {
    return useQuery(
        [QUERY_KEYS.ASIGNATURAS, 'search', searchTerm],
        () => asignaturasService.searchByName(searchTerm),
        {
            enabled: !!searchTerm && searchTerm.length >= 2,
            staleTime: 2 * 60 * 1000,
            retry: 2,
            ...options,
        }
    );
};

// Hook para validar asignatura
export const useValidateAsignatura = () => {
    return useMutation(
        (asignaturaData) => asignaturasService.validate(asignaturaData),
        {
            onError: (error) => {
                console.error('Error validando asignatura:', error);
            },
        }
    );
};

// Hook para operaciones bulk
export const useBulkAsignaturas = () => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const bulkUpdate = useMutation(
        (asignaturasData) => asignaturasService.bulkUpdate(asignaturasData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries([QUERY_KEYS.ASIGNATURAS]);
                toast.success('Asignaturas actualizadas exitosamente');
            },
            onError: (error) => {
                console.error('Error en actualización masiva:', error);
                toast.error(t('common.messages.error'));
            },
        }
    );

    const bulkDelete = useMutation(
        (ids) => asignaturasService.bulkDelete(ids),
        {
            onSuccess: () => {
                queryClient.invalidateQueries([QUERY_KEYS.ASIGNATURAS]);
                toast.success('Asignaturas eliminadas exitosamente');
            },
            onError: (error) => {
                console.error('Error en eliminación masiva:', error);
                toast.error(t('common.messages.error'));
            },
        }
    );

    return {
        bulkUpdate,
        bulkDelete,
    };
};

// Hook para filtros avanzados
export const useAsignaturasFilter = (initialFilters = {}) => {
    const [filters, setFilters] = React.useState(initialFilters);

    const query = useQuery(
        [QUERY_KEYS.ASIGNATURAS, 'filtered', filters],
        () => asignaturasService.filter(filters),
        {
            enabled: Object.keys(filters).length > 0,
            staleTime: 1 * 60 * 1000,
            retry: 2,
        }
    );

    const updateFilter = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const clearFilters = () => {
        setFilters({});
    };

    return {
        ...query,
        filters,
        updateFilter,
        clearFilters,
        setFilters,
    };
};

// Hook personalizado para manejo de asignaturas con estado local
export const useAsignaturasManager = () => {
    const queryClient = useQueryClient();

    // Obtener asignaturas del cache
    const getAsignaturasFromCache = () => {
        return queryClient.getQueryData([QUERY_KEYS.ASIGNATURAS]) || [];
    };

    // Actualizar asignatura en cache
    const updateAsignaturaInCache = (id, updatedData) => {
        queryClient.setQueryData([QUERY_KEYS.ASIGNATURAS], (oldData) => {
            if (!oldData) return oldData;

            return oldData.map(asignatura =>
                asignatura.id === id
                    ? { ...asignatura, ...updatedData }
                    : asignatura
            );
        });
    };

    // Remover asignatura del cache
    const removeAsignaturaFromCache = (id) => {
        queryClient.setQueryData([QUERY_KEYS.ASIGNATURAS], (oldData) => {
            if (!oldData) return oldData;
            return oldData.filter(asignatura => asignatura.id !== id);
        });
    };

    return {
        getAsignaturasFromCache,
        updateAsignaturaInCache,
        removeAsignaturaFromCache,
    };
};