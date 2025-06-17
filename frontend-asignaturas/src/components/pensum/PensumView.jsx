import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plus, Save, Download, Upload, BarChart3 } from 'lucide-react';
import { usePensum } from '../../hooks/usePensum';
import Card from '../common/Card';
import Button from '../common/Button';
import SemestreCard from './SemestreCard';
import PlanEstudiosForm from './PlanEstudiosForm';
import ValidationAlert from '../validacion/ValidationAlert';
import LoadingSpinner from '../common/LoadingSpinner';

const PensumView = () => {
    const { t } = useTranslation();
    const { data: pensum, isLoading, error } = usePensum();
    const [showForm, setShowForm] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);

    const totalCredits = pensum?.semestres?.reduce((total, sem) =>
        total + (sem.creditos || 0), 0) || 0;

    const handleSavePensum = () => {
        // Lógica para guardar pensum
        console.log('Guardando pensum...');
    };

    const handleValidatePensum = () => {
        // Lógica de validación
        const errors = [];

        if (totalCredits < 140) {
            errors.push('El plan debe tener al menos 140 créditos');
        }

        if (totalCredits > 200) {
            errors.push('El plan no puede exceder 200 créditos');
        }

        setValidationErrors(errors);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo Plan
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleValidatePensum}
                        >
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Validar
                        </Button>

                        <Button
                            variant="outline"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Exportar
                        </Button>

                        <Button
                            onClick={handleSavePensum}
                            className="btn-university-primary"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Guardar
                        </Button>
                    </div>
                </div>

                {/* Validaciones */}
                {validationErrors.length > 0 && (
                    <ValidationAlert
                        type="warning"
                        title="Errores de validación"
                        message={
                            <ul className="list-disc list-inside">
                                {validationErrors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        }
                        dismissible
                        onClose={() => setValidationErrors([])}
                    />
                )}

                {/* Resumen del pensum */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="text-center">
                        <div className="text-2xl font-bold text-university-purple">
                            {pensum?.semestres?.length || 0}
                        </div>
                        <div className="text-sm text-gray-600">Semestres</div>
                    </Card>

                    <Card className="text-center">
                        <div className="text-2xl font-bold text-university-blue">
                            {totalCredits}
                        </div>
                        <div className="text-sm text-gray-600">Créditos Totales</div>
                    </Card>

                    <Card className="text-center">
                        <div className="text-2xl font-bold text-success-600">
                            {pensum?.asignaturas?.filter(a => a.obligatoria).length || 0}
                        </div>
                        <div className="text-sm text-gray-600">Obligatorias</div>
                    </Card>

                    <Card className="text-center">
                        <div className="text-2xl font-bold text-warning-600">
                            {pensum?.asignaturas?.filter(a => !a.obligatoria).length || 0}
                        </div>
                        <div className="text-sm text-gray-600">Electivas</div>
                    </Card>
                </div>

                {/* Grid de semestres */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {pensum?.semestres?.map((semestre, index) => (
                            <SemestreCard
                                key={semestre.id || index}
                                semestre={semestre}
                                numero={index + 1}
                            />
                        )) ||
                        // Mostrar semestres vacíos si no hay datos
                        Array.from({ length: 10 }, (_, index) => (
                            <SemestreCard
                                key={index}
                                semestre={{ asignaturas: [], creditos: 0 }}
                                numero={index + 1}
                            />
                        ))}
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