import React from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Eye, Clock, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import Card from '../common/Card';
import Button from '../common/Button';

const AsignaturaCard = ({ asignatura, onEdit, onView }) => {
    const { t } = useTranslation();

    const statusColor = asignatura.activa ? 'success' : 'danger';
    const statusIcon = asignatura.activa ? CheckCircle : XCircle;
    const StatusIcon = statusIcon;

    return (
        <Card hover className="h-full">
            <div className="flex flex-col h-full">
                {/* Header con estado */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {asignatura.codigo}
              </span>
                            <div className={clsx(
                                'flex items-center space-x-1 text-xs px-2 py-1 rounded-full',
                                asignatura.activa
                                    ? 'text-success-700 bg-success-50'
                                    : 'text-danger-700 bg-danger-50'
                            )}>
                                <StatusIcon className="h-3 w-3" />
                                <span>
                  {asignatura.activa ? t('common.labels.active') : t('common.labels.inactive')}
                </span>
                            </div>
                        </div>

                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                            {asignatura.nombre}
                        </h3>

                        {asignatura.descripcion && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                {asignatura.descripcion}
                            </p>
                        )}
                    </div>
                </div>

                {/* Información académica */}
                <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2">
                            <BookOpen className="h-4 w-4 text-primary-500" />
                            <div>
                                <p className="text-xs text-gray-500">{t('common.labels.credits')}</p>
                                <p className="text-sm font-medium">{asignatura.creditos}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-primary-500" />
                            <div>
                                <p className="text-xs text-gray-500">Horas</p>
                                <p className="text-sm font-medium">
                                    {(asignatura.horasTeoricas || 0) + (asignatura.horasPracticas || 0)}h
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Detalles de horas */}
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <span className="text-gray-500">Teóricas:</span>
                                <span className="ml-1 font-medium">{asignatura.horasTeoricas || 0}h</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Prácticas:</span>
                                <span className="ml-1 font-medium">{asignatura.horasPracticas || 0}h</span>
                            </div>
                        </div>
                    </div>

                    {/* Información adicional */}
                    {asignatura.numeroSemestre && (
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{t('common.labels.semester')} {asignatura.numeroSemestre}</span>
                            {asignatura.prerrequisitos?.length > 0 && (
                                <span>{asignatura.prerrequisitos.length} {t('common.labels.prerequisites')}</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Acciones */}
                <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-100">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onView}
                        title={t('common.actions.view')}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onEdit}
                        title={t('common.actions.edit')}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default AsignaturaCard;