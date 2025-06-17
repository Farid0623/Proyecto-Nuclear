import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
    Search, Filter, BookOpen, RefreshCw,
    Grid, List, SortAsc, SortDesc
} from 'lucide-react';
import { useAsignaturasDisponibles } from '../../hooks/usePensum';
import { useAsignaturas } from '../../hooks/useAsignaturas';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import LoadingSpinner from '../common/LoadingSpinner';
import AsignaturaDragDrop from './AsignaturaDragDrop';

const AsignaturasPanel = ({
                              planId,
                              searchTerm,
                              onSearch,
                              selectedSemestre = null
                          }) => {
    // Estados locales
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('nombre');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filters, setFilters] = useState({
        programa: '',
        facultad: '',
        creditos: '',
        tipo: 'all',
        estado: 'active'
    });
    const [showFilters, setShowFilters] = useState(false);

    // Hooks de datos
    const {
        data: asignaturasDisponibles,
        isLoading: loadingDisponibles,
        refetch: refetchDisponibles
    } = useAsignaturasDisponibles(planId, selectedSemestre);

    const {
        data: todasAsignaturas,
        isLoading: loadingTodas
    } = useAsignaturas();

    // Determinar qué asignaturas mostrar
    const asignaturasParaMostrar = useMemo(() => {
        if (planId && asignaturasDisponibles) {
            return asignaturasDisponibles;
        }
        return (todasAsignaturas || []).filter(a => a?.activa);
    }, [planId, asignaturasDisponibles, todasAsignaturas]);

    // Filtrar y ordenar asignaturas - REFACTORIZADO para evitar operador ternario anidado
    const asignaturasFiltradas = useMemo(() => {
        let resultado = asignaturasParaMostrar || [];

        // Aplicar búsqueda por texto
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            resultado = resultado.filter(asignatura => {
                const nombre = asignatura?.nombre?.toLowerCase() || '';
                const codigo = asignatura?.codigo?.toLowerCase() || '';
                return nombre.includes(searchLower) || codigo.includes(searchLower);
            });
        }

        // Aplicar filtros
        if (filters.creditos) {
            resultado = resultado.filter(a => a?.creditos?.toString() === filters.creditos);
        }

        if (filters.tipo !== 'all') {
            resultado = resultado.filter(a => {
                switch (filters.tipo) {
                    case 'teorica':
                        return !a?.esPractica && !a?.esLaboratorio;
                    case 'practica':
                        return a?.esPractica;
                    case 'laboratorio':
                        return a?.esLaboratorio;
                    default:
                        return true;
                }
            });
        }

        // REFACTORIZADO: Extraer operador ternario anidado
        if (filters.estado !== 'all') {
            if (filters.estado === 'active') {
                resultado = resultado.filter(a => a?.activa);
            } else {
                resultado = resultado.filter(a => !a?.activa);
            }
        }

        // Aplicar ordenamiento
        resultado.sort((a, b) => {
            let valueA = a?.[sortBy] || '';
            let valueB = b?.[sortBy] || '';

            if (typeof valueA === 'string') {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return valueA > valueB ? 1 : -1;
            }
            return valueA < valueB ? 1 : -1;
        });

        return resultado;
    }, [asignaturasParaMostrar, searchTerm, filters, sortBy, sortOrder]);

    // Handlers
    const handleSortChange = (newSortBy) => {
        if (sortBy === newSortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder('asc');
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            programa: '',
            facultad: '',
            creditos: '',
            tipo: 'all',
            estado: 'active'
        });
        if (onSearch && typeof onSearch === 'function') {
            onSearch('');
        }
    };

    const handleRefresh = () => {
        if (refetchDisponibles && typeof refetchDisponibles === 'function') {
            refetchDisponibles();
        }
    };

    const handleSearch = (value) => {
        if (onSearch && typeof onSearch === 'function') {
            onSearch(value);
        }
    };

    const isLoading = loadingDisponibles || loadingTodas;

    // Calcular estadísticas
    const stats = {
        disponibles: asignaturasFiltradas.length,
        creditos: asignaturasFiltradas.reduce((sum, a) => sum + (a?.creditos || 0), 0),
        activas: asignaturasFiltradas.filter(a => a?.activa).length
    };

    // REFACTORIZADO: Función para determinar el mensaje cuando no hay asignaturas
    const getEmptyMessage = () => {
        const hasActiveFilters = searchTerm || Object.values(filters).some(f => f && f !== 'all');

        if (hasActiveFilters) {
            return 'No se encontraron asignaturas';
        }

        return 'No hay asignaturas disponibles';
    };

    // REFACTORIZADO: Función para determinar si mostrar botón de limpiar filtros
    const shouldShowClearFilters = () => {
        return searchTerm || Object.values(filters).some(f => f && f !== 'all');
    };

    return (
        <Card className="h-full flex flex-col">
            <Card.Header>
                <div className="flex items-center justify-between">
                    <Card.Title className="flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-university-purple" />
                        Asignaturas
                        {planId ? ' Disponibles' : ' Totales'}
                    </Card.Title>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={isLoading}
                        >
                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Estadísticas rápidas */}
                <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                    <div className="text-center bg-gray-50 rounded p-2">
                        <div className="font-semibold text-gray-900">{stats.disponibles}</div>
                        <div className="text-gray-500">Disponibles</div>
                    </div>
                    <div className="text-center bg-blue-50 rounded p-2">
                        <div className="font-semibold text-blue-900">{stats.creditos}</div>
                        <div className="text-blue-600">Créditos</div>
                    </div>
                    <div className="text-center bg-green-50 rounded p-2">
                        <div className="font-semibold text-green-900">{stats.activas}</div>
                        <div className="text-green-600">Activas</div>
                    </div>
                </div>
            </Card.Header>

            {/* Búsqueda */}
            <div className="px-6 pb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        type="text"
                        placeholder="Buscar asignaturas..."
                        value={searchTerm || ''}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10 text-sm"
                    />
                </div>
            </div>

            {/* Filtros avanzados */}
            {showFilters && (
                <div className="px-6 pb-4 border-b border-gray-200">
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <Select
                                value={filters.creditos}
                                onChange={(e) => handleFilterChange('creditos', e.target.value)}
                                className="text-sm"
                            >
                                <option value="">Todos los créditos</option>
                                {[1,2,3,4,5,6,7,8,9,10].map(c => (
                                    <option key={c} value={c}>{c} créditos</option>
                                ))}
                            </Select>

                            <Select
                                value={filters.tipo}
                                onChange={(e) => handleFilterChange('tipo', e.target.value)}
                                className="text-sm"
                            >
                                <option value="all">Todos los tipos</option>
                                <option value="teorica">Teórica</option>
                                <option value="practica">Práctica</option>
                                <option value="laboratorio">Laboratorio</option>
                            </Select>
                        </div>

                        <div className="flex justify-between items-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="text-xs"
                            >
                                Limpiar filtros
                            </Button>

                            <div className="flex items-center space-x-1">
                                <Button
                                    variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <Grid className="h-3 w-3" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'primary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                >
                                    <List className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Controles de ordenamiento */}
            <div className="px-6 py-2 border-b border-gray-200">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Ordenar por:</span>
                    <div className="flex items-center space-x-2">
                        {['nombre', 'codigo', 'creditos'].map((field) => (
                            <Button
                                key={field}
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSortChange(field)}
                                className={`text-xs ${sortBy === field ? 'text-university-purple' : 'text-gray-500'}`}
                            >
                                {field}
                                {sortBy === field && (
                                    sortOrder === 'asc' ? <SortAsc className="h-3 w-3 ml-1" /> : <SortDesc className="h-3 w-3 ml-1" />
                                )}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lista de asignaturas */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <LoadingSpinner size="md" text="Cargando..." />
                    </div>
                ) : asignaturasFiltradas.length === 0 ? (
                    <div className="text-center py-8">
                        <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm mb-2">
                            {getEmptyMessage()}
                        </p>
                        {shouldShowClearFilters() && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="text-xs"
                            >
                                Limpiar filtros
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {asignaturasFiltradas.map((asignatura) => (
                            <AsignaturaDragDrop
                                key={asignatura?.id || asignatura?.codigo}
                                asignatura={asignatura}
                                draggable={true}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer con información */}
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-gray-500 text-center">
                    {planId
                        ? 'Arrastra las asignaturas a los semestres del pensum'
                        : 'Selecciona un plan de estudios para ver asignaturas disponibles'
                    }
                </p>
            </div>
        </Card>
    );
};

// PropTypes
AsignaturasPanel.propTypes = {
    planId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    searchTerm: PropTypes.string,
    onSearch: PropTypes.func.isRequired,
    selectedSemestre: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

AsignaturasPanel.defaultProps = {
    planId: null,
    searchTerm: '',
    selectedSemestre: null
};

export default AsignaturasPanel;