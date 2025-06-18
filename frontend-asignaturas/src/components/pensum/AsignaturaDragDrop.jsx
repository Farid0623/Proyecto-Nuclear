import React from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import { BookOpen, X, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import Button from '../common/Button';

const AsignaturaDragDrop = ({ asignatura, onRemove, draggable = true }) => {
    // Validar props con valores por defecto
    const asignaturaData = {
        id: asignatura?.id || '',
        codigo: asignatura?.codigo || '',
        nombre: asignatura?.nombre || '',
        creditos: asignatura?.creditos || 0,
        horasTeoricas: asignatura?.horasTeoricas || 0,
        horasPracticas: asignatura?.horasPracticas || 0,
        prerrequisitos: asignatura?.prerrequisitos || []
    };

    const [{ isDragging }, drag] = useDrag({
        type: 'asignatura',
        item: { asignatura: asignaturaData },
        canDrag: draggable,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const handleRemove = () => {
        if (onRemove && typeof onRemove === 'function') {
            onRemove();
        }
    };

    return (
        <div
            ref={draggable ? drag : null}
            className={clsx(
                'p-3 bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200',
                draggable && 'cursor-move hover:shadow-md',
                isDragging && 'opacity-50 scale-105 rotate-1',
                !draggable && 'cursor-default'
            )}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                        <BookOpen className="h-4 w-4 text-university-purple" />
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {asignaturaData.codigo}
                        </span>
                        <span className="text-xs text-university-purple font-medium">
                            {asignaturaData.creditos} créditos
                        </span>
                    </div>

                    <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                        {asignaturaData.nombre}
                    </h4>

                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{asignaturaData.horasTeoricas + asignaturaData.horasPracticas}h</span>
                        </div>

                        {asignaturaData.prerrequisitos.length > 0 && (
                            <span className="bg-blue-100 text-blue-700 px-1 rounded">
                                {asignaturaData.prerrequisitos.length} req.
                            </span>
                        )}
                    </div>
                </div>

                {onRemove && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemove}
                        className="text-gray-400 hover:text-danger-600 p-1"
                        title="Remover asignatura"
                    >
                        <X className="h-3 w-3" />
                    </Button>
                )}
            </div>
        </div>
    );
};

// Definición de PropTypes
AsignaturaDragDrop.propTypes = {
    asignatura: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        codigo: PropTypes.string,
        nombre: PropTypes.string,
        creditos: PropTypes.number,
        horasTeoricas: PropTypes.number,
        horasPracticas: PropTypes.number,
        prerrequisitos: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            codigo: PropTypes.string,
            nombre: PropTypes.string
        }))
    }).isRequired,
    onRemove: PropTypes.func,
    draggable: PropTypes.bool
};

// Valores por defecto
AsignaturaDragDrop.defaultProps = {
    onRemove: null,
    draggable: true
};

export default AsignaturaDragDrop;