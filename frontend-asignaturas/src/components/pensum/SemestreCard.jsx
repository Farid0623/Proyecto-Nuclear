import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDrop } from 'react-dnd';
import {
    Plus, BookOpen, Clock, AlertTriangle, CheckCircle,
    MoreVertical, Trash2, Eye
} from 'lucide-react';
import { clsx } from 'clsx';
import {
    useAddAsignaturaToSemestre,
    useRemoveAsignaturaFromSemestre,
    useCheckConflictos,
    useValidateSemestre
} from '../../hooks/usePensum';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import AsignaturaDragDrop from './AsignaturaDragDrop';
import SemestreDetailsModal from './SemestreDetailsModal';
import toast from 'react-hot-toast';

const SemestreCard = ({
                          semestre,
                          numero,
                          planId,
                          onAsignaturaMove,
                          readOnly = false
                      }) => {
    const { t } = useTranslation();

    // Estados locales
    const [showDetails, setShowDetails] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(null);
    const [draggedOver, setDraggedOver] = useState(false);

    // Mutations
    const addAsignaturaMutation = useAddAsignaturaToSemestre();
    const removeAsignaturaMutation = useRemoveAsignaturaFromSemestre();
    const checkConflictosMutation = useCheckConflictos();
    const validateSemestreMutation = useValidateSemestre();

    // Validación de props con valores por defecto
    const semestreData = {
        id: semestre?.id || null,
        asignaturas: semestre?.asignaturas || [],
        observaciones: semestre?.observaciones || '',
        creditos: semestre?.creditos || 0
    };

    // Configurar drag and drop
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: 'asignatura',
        drop: async (item) => {
            const { asignatura } = item;

            // Verificar conflictos antes de agregar
            try {
                const conflictos = await checkConflictosMutation.mutateAsync({
                    planId,
                    asignaturaId: asignatura.id,
                    newSemestre: numero
                });

                if (conflictos.hasConflicts) {
                    toast.error(`Conflictos detectados: ${conflictos.conflicts.join(', ')}`);
                    return;
                }

                // Agregar asignatura al semestre
                await addAsignaturaMutation.mutateAsync({
                    planId,
                    semestreNumero: numero,
                    asignaturaId: asignatura.id
                });

                if (onAsignaturaMove) {
                    onAsignaturaMove(asignatura, null, numero);
                }
            } catch (error) {
                console.error('Error al agregar asignatura:', error);
            }
        },
        canDrop: (item) => {
            // Verificar si la asignatura ya está en este semestre
            const asignaturaYaExiste = semestreData.asignaturas.some(
                a => a.id === item.asignatura.id
            );
            return !asignaturaYaExiste && !readOnly;
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    });

    // Calcular estadísticas del semestre
    const totalCreditos = semestreData.asignaturas.reduce((sum, asig) =>
        sum + (asig.creditos || 0), 0);

    const totalHoras = semestreData.asignaturas.reduce((sum, asig) =>
        sum + ((asig.horasTeoricas || 0) + (asig.horasPracticas || 0)), 0);

    const creditosValidos = totalCreditos >= 12 && totalCreditos <= 20;
    const numeroAsignaturas = semestreData.asignaturas.length;

    // Función para determinar las clases CSS del contenedor - Extraída operación ternaria anidada
    const getContainerClasses = () => {
        const baseClasses = 'h-full min-h-[400px] transition-all duration-200';

        if (isOver && canDrop) {
            return `${baseClasses} ring-2 ring-university-purple bg-university-light-gradient scale-105`;
        }

        if (isOver && !canDrop) {
            return `${baseClasses} ring-2 ring-red-400 bg-red-50`;
        }

        if (!creditosValidos && totalCreditos > 0) {
            return `${baseClasses} ring-2 ring-warning-400`;
        }

        if (draggedOver) {
            return `${baseClasses} shadow-lg`;
        }

        return baseClasses;
    };

    // Función para determinar las clases CSS del badge de créditos - Extraída operación ternaria anidada
    const getCreditosBadgeClasses = () => {
        const baseClasses = 'px-2 py-1 rounded text-sm font-medium';

        if (creditosValidos) {
            return `${baseClasses} bg-success-100 text-success-800`;
        }

        if (totalCreditos > 20) {
            return `${baseClasses} bg-danger-100 text-danger-800`;
        }

        if (totalCreditos > 0) {
            return `${baseClasses} bg-warning-100 text-warning-800`;
        }

        return `${baseClasses} bg-gray-100 text-gray-600`;
    };

    // Función para determinar el mensaje de estado - Extraída operación ternaria anidada
    const getStatusMessage = () => {
        if (creditosValidos) return null;
        if (totalCreditos === 0) return null;
        if (totalCreditos < 12) return 'Muy pocos créditos';
        if (totalCreditos > 20) return 'Excede máximo';
        return null;
    };

    // Función para determinar el contenido del área de drop - Extraída operación ternaria anidada
    const getDropAreaContent = () => {
        if (isOver && canDrop) {
            return 'Suelta aquí la asignatura';
        }

        if (isOver && !canDrop) {
            return 'No se puede agregar aquí';
        }

        return t('curriculum.dragSubject');
    };

    // Función para determinar las clases del área de drop - Extraída operación ternaria anidada
    const getDropAreaClasses = () => {
        const baseClasses = 'text-center py-8 border-2 border-dashed rounded-lg transition-colors';

        if (isOver && canDrop) {
            return `${baseClasses} border-university-purple bg-university-light-gradient`;
        }

        return `${baseClasses} border-gray-300`;
    };

    // Handler para remover asignatura
    const handleRemoveAsignatura = async (asignaturaId) => {
        try {
            await removeAsignaturaMutation.mutateAsync({
                planId,
                semestreNumero: numero,
                asignaturaId
            });
            setShowConfirmDelete(null);
        } catch (error) {
            console.error('Error removiendo asignatura:', error);
        }
    };

    // Handler para validar semestre
    const handleValidateSemestre = async () => {
        try {
            const validation = await validateSemestreMutation.mutateAsync({
                planId,
                semestreNumero: numero
            });

            if (validation.isValid) {
                toast.success('Semestre válido');
            } else {
                toast.error(`Errores: ${validation.errors.join(', ')}`);
            }
        } catch (error) {
            console.error('Error validando semestre:', error);
        }
    };

    return (
        <>
            <Card
                ref={drop}
                className={getContainerClasses()}
                hover={!isOver}
            >
                <Card.Header>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {t('curriculum.semester', { number: numero })}
                            </h3>
                            {!creditosValidos && totalCreditos > 0 && (
                                <AlertTriangle className="h-4 w-4 text-warning-500" />
                            )}
                            {creditosValidos && (
                                <CheckCircle className="h-4 w-4 text-success-500" />
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className={getCreditosBadgeClasses()}>
                                {totalCreditos} créditos
                            </div>

                            {!readOnly && (
                                <div className="relative group">
                                    <Button variant="ghost" size="sm">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                    <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                        <div className="py-1">
                                            <button
                                                type="button"
                                                onClick={() => setShowDetails(true)}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                Ver Detalles
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleValidateSemestre}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                disabled={validateSemestreMutation.isLoading}
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Validar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                        <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                                <BookOpen className="h-3 w-3 mr-1" />
                                {numeroAsignaturas} materias
                            </span>
                            <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {totalHoras}h totales
                            </span>
                        </div>

                        {getStatusMessage() && (
                            <span className="text-warning-600 text-xs">
                                {getStatusMessage()}
                            </span>
                        )}
                    </div>
                </Card.Header>

                <Card.Content>
                    <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                        {semestreData.asignaturas.length > 0 ? (
                            semestreData.asignaturas.map((asignatura) => (
                                <AsignaturaDragDrop
                                    key={asignatura.id}
                                    asignatura={asignatura}
                                    draggable={!readOnly}
                                    onRemove={!readOnly ? () => setShowConfirmDelete(asignatura.id) : null}
                                    showDetails={true}
                                    semestre={numero}
                                />
                            ))
                        ) : (
                            <div className={getDropAreaClasses()}>
                                <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm">
                                    {getDropAreaContent()}
                                </p>
                            </div>
                        )}
                    </div>
                </Card.Content>

                <Card.Footer>
                    <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                            {semestreData.observaciones && (
                                <span title={semestreData.observaciones}>
                                    📝 {semestreData.observaciones.substring(0, 20)}...
                                </span>
                            )}
                        </div>

                        {!readOnly && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => console.log('Agregar asignatura manualmente')}
                                title="Agregar asignatura"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </Card.Footer>
            </Card>

            {/* Modal de confirmación para eliminar */}
            {showConfirmDelete && (
                <Modal
                    isOpen={true}
                    onClose={() => setShowConfirmDelete(null)}
                    title="Confirmar Eliminación"
                    size="sm"
                >
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            ¿Estás seguro de que quieres remover esta asignatura del semestre?
                        </p>

                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowConfirmDelete(null)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => handleRemoveAsignatura(showConfirmDelete)}
                                loading={removeAsignaturaMutation.isLoading}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remover
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Modal de detalles del semestre */}
            {showDetails && (
                <SemestreDetailsModal
                    semestre={semestre}
                    numero={numero}
                    planId={planId}
                    onClose={() => setShowDetails(false)}
                />
            )}
        </>
    );
};

// PropTypes completos
SemestreCard.propTypes = {
    semestre: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        asignaturas: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            codigo: PropTypes.string,
            nombre: PropTypes.string,
            creditos: PropTypes.number,
            horasTeoricas: PropTypes.number,
            horasPracticas: PropTypes.number
        })),
        observaciones: PropTypes.string,
        creditos: PropTypes.number
    }).isRequired,
    numero: PropTypes.number.isRequired,
    planId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onAsignaturaMove: PropTypes.func,
    readOnly: PropTypes.bool
};

SemestreCard.defaultProps = {
    onAsignaturaMove: null,
    readOnly: false
};

export default SemestreCard;