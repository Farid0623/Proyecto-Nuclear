import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Filter } from 'lucide-react';
import { useAsignaturas } from '../../hooks/useAsignaturas';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import LoadingSpinner from '../common/LoadingSpinner';
import AsignaturaCard from './AsignaturaCard';
import AsignaturaFilter from './AsignaturaFilter';

const AsignaturaList = ({ onCreateNew, onEdit, onView }) => {
    const { t } = useTranslation();
    const { data: asignaturas, isLoading, error } = useAsignaturas();
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        semester: '',
        credits: ''
    });

    // Validar props con valores por defecto
    const handlers = {
        onCreateNew: onCreateNew || (() => console.warn('onCreateNew handler not provided')),
        onEdit: onEdit || (() => console.warn('onEdit handler not provided')),
        onView: onView || (() => console.warn('onView handler not provided'))
    };

    // Filtrar asignaturas
    const filteredAsignaturas = (asignaturas || []).filter(asignatura => {
        // Validar que asignatura tenga las propiedades necesarias
        const asignaturaData = {
            nombre: asignatura?.nombre || '',
            codigo: asignatura?.codigo || '',
            activa: asignatura?.activa ?? false,
            numeroSemestre: asignatura?.numeroSemestre || null,
            creditos: asignatura?.creditos || null
        };

        const matchesSearch = asignaturaData.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asignaturaData.codigo.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filters.status === 'all' ||
            (filters.status === 'active' && asignaturaData.activa) ||
            (filters.status === 'inactive' && !asignaturaData.activa);

        const matchesSemester = !filters.semester ||
            asignaturaData.numeroSemestre?.toString() === filters.semester;

        const matchesCredits = !filters.credits ||
            asignaturaData.creditos?.toString() === filters.credits;

        return matchesSearch && matchesStatus && matchesSemester && matchesCredits;
    });

    // Handlers con validación
    const handleCreateNew = () => {
        handlers.onCreateNew();
    };

    const handleEdit = (asignatura) => {
        if (asignatura) {
            handlers.onEdit(asignatura);
        }
    };

    const handleView = (asignatura) => {
        if (asignatura) {
            handlers.onView(asignatura);
        }
    };

    const handleToggleFilters = () => {
        setShowFilters(!showFilters);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-danger-600">{t('common.messages.error')}</p>
            </div>
        );
    }

    // Calcular estadísticas con validación
    const stats = {
        total: (asignaturas || []).length,
        active: (asignaturas || []).filter(a => a?.activa).length,
        inactive: (asignaturas || []).filter(a => !a?.activa).length,
        avgCredits: (asignaturas || []).length > 0
            ? ((asignaturas || []).reduce((sum, a) => sum + (a?.creditos || 0), 0) / (asignaturas || []).length).toFixed(1)
            : '0'
    };

    return (
        <div className="space-y-6">
            {/* Header con acciones */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {t('subjects.listTitle')}
                    </h2>
                    <p className="text-gray-600 mt-1">
                        {t('subjects.subtitle')}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        onClick={handleToggleFilters}
                        className="flex items-center"
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        {t('common.actions.filter')}
                    </Button>

                    <Button onClick={handleCreateNew}>
                        <Plus className="h-4 w-4 mr-2" />
                        {t('subjects.createSubject')}
                    </Button>
                </div>
            </div>

            {/* Búsqueda y filtros */}
            <Card>
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder={`${t('common.actions.search')}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {showFilters && (
                        <AsignaturaFilter
                            filters={filters}
                            onFiltersChange={setFilters}
                        />
                    )}
                </div>
            </Card>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                        {stats.total}
                    </div>
                    <div className="text-sm text-gray-600">
                        {t('subjects.stats.total')}
                    </div>
                </Card>

                <Card className="text-center">
                    <div className="text-2xl font-bold text-success-600">
                        {stats.active}
                    </div>
                    <div className="text-sm text-gray-600">
                        {t('subjects.stats.active')}
                    </div>
                </Card>

                <Card className="text-center">
                    <div className="text-2xl font-bold text-danger-600">
                        {stats.inactive}
                    </div>
                    <div className="text-sm text-gray-600">
                        {t('subjects.stats.inactive')}
                    </div>
                </Card>

                <Card className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                        {stats.avgCredits}
                    </div>
                    <div className="text-sm text-gray-600">
                        {t('subjects.stats.avgCredits')}
                    </div>
                </Card>
            </div>

            {/* Lista de asignaturas */}
            {filteredAsignaturas.length === 0 ? (
                <Card>
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">
                            {searchTerm || Object.values(filters).some(f => f && f !== 'all')
                                ? 'No se encontraron asignaturas con los filtros aplicados'
                                : t('common.messages.noData')
                            }
                        </p>
                        {!searchTerm && Object.values(filters).every(f => !f || f === 'all') && (
                            <Button onClick={handleCreateNew}>
                                <Plus className="h-4 w-4 mr-2" />
                                {t('subjects.createSubject')}
                            </Button>
                        )}
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredAsignaturas.map((asignatura) => (
                        <AsignaturaCard
                            key={asignatura.id || asignatura.codigo}
                            asignatura={asignatura}
                            onEdit={() => handleEdit(asignatura)}
                            onView={() => handleView(asignatura)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Definición de PropTypes
AsignaturaList.propTypes = {
    onCreateNew: PropTypes.func,
    onEdit: PropTypes.func,
    onView: PropTypes.func
};

// Valores por defecto
AsignaturaList.defaultProps = {
    onCreateNew: null,
    onEdit: null,
    onView: null
};

export default AsignaturaList;