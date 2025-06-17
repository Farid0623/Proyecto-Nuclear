import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDrop } from 'react-dnd';
import { Plus, BookOpen, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import Card from '../common/Card';
import Button from '../common/Button';
import AsignaturaDragDrop from './AsignaturaDragDrop';

const SemestreCard = ({ semestre, numero, onAddAsignatura, onRemoveAsignatura }) => {
    const { t } = useTranslation();

    const [{ isOver }, drop] = useDrop({
        accept: 'asignatura',
        drop: (item) => {
            if (onAddAsignatura) {
                onAddAsignatura(item.asignatura, numero);
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    const totalCreditos = semestre.asignaturas?.reduce((sum, asig) =>
        sum + (asig.creditos || 0), 0) || 0;

    const creditosValidos = totalCreditos >= 12 && totalCreditos <= 20;

    return (
        <Card
            ref={drop}
            className={clsx(
                'h-full min-h-[400px] transition-all duration-200',
                isOver && 'ring-2 ring-university-purple bg-university-light-gradient',
                !creditosValidos && totalCreditos > 0 && 'ring-2 ring-warning-400'
            )}
        >
            <Card.Header>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {t('curriculum.semester', { number: numero })}
                    </h3>
                    <div className={clsx(
                        'px-2 py-1 rounded text-sm font-medium',
                        creditosValidos
                            ? 'bg-success-100 text-success-800'
                            : totalCreditos > 20
                                ? 'bg-danger-100 text-danger-800'
                                : totalCreditos > 0
                                    ? 'bg-warning-100 text-warning-800'
                                    : 'bg-gray-100 text-gray-600'
                    )}>
                        {totalCreditos} créditos
                    </div>
                </div>
            </Card.Header>

            <Card.Content>
                <div className="space-y-3">
                    {semestre.asignaturas?.length > 0 ? (
                        semestre.asignaturas.map((asignatura, index) => (
                            <AsignaturaDragDrop
                                key={asignatura.id || index}
                                asignatura={asignatura}
                                onRemove={() => onRemoveAsignatura && onRemoveAsignatura(asignatura.id, numero)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                            <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">
                                {isOver ? 'Suelta aquí la asignatura' : t('curriculum.dragSubject')}
                            </p>
                        </div>
                    )}
                </div>
            </Card.Content>

            <Card.Footer>
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{semestre.asignaturas?.length || 0} materias</span>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => console.log('Agregar asignatura al semestre', numero)}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </Card.Footer>
        </Card>
    );
};

export default SemestreCard;