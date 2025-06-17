import React from 'react';
import { useDrag } from 'react-dnd';
import { BookOpen, X, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import Button from '../common/Button';

const AsignaturaDragDrop = ({ asignatura, onRemove, draggable = true }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'asignatura',
        item: { asignatura },
        canDrag: draggable,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

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
              {asignatura.codigo}
            </span>
                        <span className="text-xs text-university-purple font-medium">
              {asignatura.creditos} créditos
            </span>
                    </div>

                    <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                        {asignatura.nombre}
                    </h4>

                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{(asignatura.horasTeoricas || 0) + (asignatura.horasPracticas || 0)}h</span>
                        </div>

                        {asignatura.prerrequisitos?.length > 0 && (
                            <span className="bg-blue-100 text-blue-700 px-1 rounded">
                {asignatura.prerrequisitos.length} req.
              </span>
                        )}
                    </div>
                </div>

                {onRemove && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onRemove}
                        className="text-gray-400 hover:text-danger-600 p-1"
                    >
                        <X className="h-3 w-3" />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default AsignaturaDragDrop;