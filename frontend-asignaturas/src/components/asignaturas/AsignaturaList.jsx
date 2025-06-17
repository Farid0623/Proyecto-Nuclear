import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
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

    // Filtrar asignaturas
    const filteredAsignaturas = asignaturas?.filter(asignatura => {
        const matchesSearch = asignatura.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asignatura.codigo.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filters.status === 'all' ||
            (filters.status === 'active' && asignatura.activa) ||
            (filters.status === 'inactive' && !asignatura.activa);

        const matchesSemester = !filters.semester ||
            asignatura.numeroSemestre?.toString() === filters.semester;

        const matchesCredits = !filters.credits ||
            asignatura.creditos?.toString() === filters.credits;

        return matchesSearch && matchesStatus && matchesSemester && matchesCredits;
    }) || [];

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
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center"
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        {t('common.actions.filter')}
                    </Button>

                    <Button onClick={onCreateNew}>
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
                        {asignaturas?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">
                        {t('subjects.stats.total')}
                    </div>
                </Card>

                <Card className="text-center">
                    <div className="text-2xl font-bold text-success-600">
                        {asignaturas?.filter(a => a.activa).length || 0}
                    </div>
                    <div className="text-sm text-gray-600">
                        {t('subjects.stats.active')}
                    </div>
                </Card>

                <Card className="text-center">
                    <div className="text-2xl font-bold text-danger-600">
                        {asignaturas?.filter(a => !a.activa).length || 0}
                    </div>
                    <div className="text-sm text-gray-600">
                        {t('subjects.stats.inactive')}
                    </div>
                </Card>

                <Card className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                        {asignaturas?.length > 0
                            ? (asignaturas.reduce((sum, a) => sum + (a.creditos || 0), 0) / asignaturas.length).toFixed(1)
                            : '0'
                        }
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
                            <Button onClick={onCreateNew}>
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
                            key={asignatura.id}
                            asignatura={asignatura}
                            onEdit={() => onEdit(asignatura)}
                            onView={() => onView(asignatura)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AsignaturaList;