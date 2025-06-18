import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
    Plus, Save, Download, BarChart3,
    Filter, Search, Eye
} from 'lucide-react';
import {
    usePlanesEstudio,
    useMallaCurricular,
    useValidatePlanEstudio,
    useEstadisticasPensum,
    useUpdateMallaCurricular
} from '../../hooks/usePensum';
import { useAsignaturasActivas } from '../../hooks/useAsignaturas';
import Card from '../common/Card';
import Button from '../common/Button';
import Select from '../common/Select';
import Input from '../common/Input';
import LoadingSpinner from '../common/LoadingSpinner';
import SemestreCard from './SemestreCard';
import PlanEstudiosForm from './PlanEstudiosForm';
import ValidationAlert from '../validacion/ValidationAlert';
import AsignaturasPanel from './AsignaturasPanel';
import PensumStats from './PensumStats';

const PensumView = () => {
    const { t } = useTranslation();

    // Estados locales
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showAsignaturasPanel, setShowAsignaturasPanel] = useState(true);
    const [validationResults, setValidationResults] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'tree' | 'compact'

    // Hooks de datos
    const { data: planesEstudio, isLoading: loadingPlanes } = usePlanesEstudio();
    const { data: mallaCurricular, isLoading: loadingMalla } = useMallaCurricular(selectedPlanId);
    const { data: asignaturasActivas } = useAsignaturasActivas();
    const { data: estadisticas } = useEstadisticasPensum(selectedPlanId);

    // Mutations
    const updateMallaMutation = useUpdateMallaCurricular();
    const validatePlanMutation = useValidatePlanEstudio();

    // Seleccionar primer plan si no hay ninguno seleccionado
    React.useEffect(() => {
        if (planesEstudio && planesEstudio.length > 0 && !selectedPlanId) {
            setSelectedPlanId(planesEstudio[0].id);
        }
    }, [planesEstudio, selectedPlanId]);

    // Función para extraer operación ternaria anidada compleja
    const getCompactViewContent = (semestre, index) => {
        const defaultCreditos = semestre.creditos || 0;
        const defaultAsignaturas = semestre.asignaturas || [];

        return {
            numero: index + 1,
            creditos: defaultCreditos,
            asignaturas: defaultAsignaturas
        };
    };

    // Handlers
    const handlePlanChange = useCallback((planId) => {
        setSelectedPlanId(planId);
        setValidationResults(null);
    }, []);

    const handleSaveMalla = useCallback(async () => {
        if (!selectedPlanId || !mallaCurricular) return;

        try {
            await updateMallaMutation.mutateAsync({
                planId: selectedPlanId,
                mallaData: mallaCurricular
            });
        } catch (error) {
            console.error('Error guardando malla:', error);
        }
    }, [selectedPlanId, mallaCurricular, updateMallaMutation]);

    const handleValidatePlan = useCallback(async () => {
        if (!selectedPlanId) return;

        try {
            const results = await validatePlanMutation.mutateAsync(selectedPlanId);
            setValidationResults(results);
        } catch (error) {
            console.error('Error validando plan:', error);
        }
    }, [selectedPlanId, validatePlanMutation]);

    const handleExportPlan = useCallback(() => {
        // Implementar exportación
        console.log('Exportando plan...');
    }, []);

    const handleAsignaturaMove = useCallback((asignatura, fromSemestre, toSemestre) => {
        // Implementar lógica de movimiento con validaciones
        console.log('Moviendo asignatura:', { asignatura, fromSemestre, toSemestre });
    }, []);

    const filteredAsignaturas = React.useMemo(() => {
        if (!asignaturasActivas) return [];

        return asignaturasActivas.filter(asignatura => {
            const matchesSearch = !searchTerm ||
                asignatura.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                asignatura.codigo.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesSearch;
        });
    }, [asignaturasActivas, searchTerm]);

    // Estados de carga
    if (loadingPlanes) {
        return (
            <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" text="Cargando planes de estudio..." />
            </div>
        );
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="space-y-6">
                {/* Header con controles */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {t('curriculum.title')}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {t('curriculum.subtitle')}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowForm(true)}
                            disabled={!selectedPlanId}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo Plan
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleValidatePlan}
                            loading={validatePlanMutation.isLoading}
                            disabled={!selectedPlanId}
                        >
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Validar
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleExportPlan}
                            disabled={!selectedPlanId}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Exportar
                        </Button>

                        <Button
                            onClick={handleSaveMalla}
                            loading={updateMallaMutation.isLoading}
                            disabled={!selectedPlanId}
                            className="btn-university-primary"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Guardar
                        </Button>
                    </div>
                </div>

                {/* Selector de plan y filtros */}
                <Card>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <Select
                            label="Plan de Estudios"
                            value={selectedPlanId || ''}
                            onChange={(e) => handlePlanChange(e.target.value)}
                        >
                            <option value="">Seleccionar plan</option>
                            {planesEstudio?.map((plan) => (
                                <option key={plan.id} value={plan.id}>
                                    {plan.nombre} ({plan.programa})
                                </option>
                            ))}
                        </Select>

                        <Select
                            label="Vista"
                            value={viewMode}
                            onChange={(e) => setViewMode(e.target.value)}
                        >
                            <option value="grid">Vista de Grilla</option>
                            <option value="tree">Vista de Árbol</option>
                            <option value="compact">Vista Compacta</option>
                        </Select>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Buscar asignaturas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Button
                            variant="outline"
                            onClick={() => setShowAsignaturasPanel(prev => !prev)}
                            className="flex items-center justify-center"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            {showAsignaturasPanel ? 'Ocultar' : 'Mostrar'} Panel
                        </Button>
                    </div>
                </Card>

                {/* Resultados de validación */}
                {validationResults && (
                    <ValidationAlert
                        type={validationResults.isValid ? 'success' : 'warning'}
                        title={validationResults.isValid ? 'Plan Válido' : 'Errores de Validación'}
                        message={
                            validationResults.isValid ? (
                                'El plan de estudios cumple con todos los requisitos'
                            ) : (
                                <ul className="list-disc list-inside space-y-1">
                                    {validationResults.errors?.map((error, index) => (
                                        <li key={`error-${index}`}>{error}</li>
                                    ))}
                                </ul>
                            )
                        }
                        dismissible
                        onClose={() => setValidationResults(null)}
                    />
                )}

                {/* Layout principal */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* Panel de asignaturas disponibles */}
                    {showAsignaturasPanel && (
                        <div className="xl:col-span-3">
                            <AsignaturasPanel
                                asignaturas={filteredAsignaturas}
                                searchTerm={searchTerm}
                                onSearch={setSearchTerm}
                                planId={selectedPlanId}
                            />
                        </div>
                    )}

                    {/* Área principal del pensum */}
                    <div className={showAsignaturasPanel ? 'xl:col-span-9' : 'xl:col-span-12'}>
                        {loadingMalla ? (
                            <div className="flex justify-center items-center py-12">
                                <LoadingSpinner size="lg" text="Cargando malla curricular..." />
                            </div>
                        ) : selectedPlanId && mallaCurricular ? (
                            <>
                                {/* Estadísticas del pensum */}
                                {estadisticas && (
                                    <PensumStats estadisticas={estadisticas} className="mb-6" />
                                )}

                                {/* Malla curricular */}
                                <div className="space-y-6">
                                    {viewMode === 'grid' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {mallaCurricular.semestres?.map((semestre, index) => (
                                                <SemestreCard
                                                    key={`semestre-${semestre.id || index}`}
                                                    semestre={semestre}
                                                    numero={index + 1}
                                                    planId={selectedPlanId}
                                                    onAsignaturaMove={handleAsignaturaMove}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {viewMode === 'tree' && (
                                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                                            <p className="text-center text-gray-500">
                                                Vista de árbol de dependencias en desarrollo
                                            </p>
                                        </div>
                                    )}

                                    {viewMode === 'compact' && (
                                        <div className="space-y-4">
                                            {mallaCurricular.semestres?.map((semestre, index) => {
                                                const compactData = getCompactViewContent(semestre, index);
                                                return (
                                                    <Card key={`compact-${semestre.id || index}`} className="p-4">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h3 className="font-semibold">
                                                                Semestre {compactData.numero}
                                                            </h3>
                                                            <span className="text-sm text-gray-600">
                                                                {compactData.creditos} créditos
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {compactData.asignaturas.map((asignatura) => (
                                                                <span
                                                                    key={`asig-${asignatura.id}`}
                                                                    className="inline-flex items-center px-2 py-1 rounded bg-university-purple text-white text-xs"
                                                                >
                                                                    {asignatura.codigo}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <Card>
                                <div className="text-center py-12">
                                    <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Selecciona un Plan de Estudios
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        Elige un plan de estudios para visualizar y editar la malla curricular
                                    </p>
                                    {planesEstudio && planesEstudio.length === 0 && (
                                        <Button onClick={() => setShowForm(true)}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Crear Primer Plan
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Modal para crear/editar plan */}
                {showForm && (
                    <PlanEstudiosForm
                        onClose={() => setShowForm(false)}
                        onSave={(data) => {
                            console.log('Guardando plan:', data);
                            setShowForm(false);
                        }}
                    />
                )}
            </div>
        </DndProvider>
    );
};

export default PensumView;