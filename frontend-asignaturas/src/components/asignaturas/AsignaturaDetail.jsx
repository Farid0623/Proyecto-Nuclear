import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Edit, Clock, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

const AsignaturaDetail = ({ asignatura, onEdit, onBack }) => {
    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="flex items-center"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('common.actions.back')}
                </Button>

                <Button onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    {t('common.actions.edit')}
                </Button>
            </div>

            {/* Información principal */}
            <Card>
                <Card.Header>
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded">
                  {asignatura.codigo}
                </span>
                                <div className={`flex items-center space-x-1 text-sm px-3 py-1 rounded-full ${
                                    asignatura.activa
                                        ? 'text-success-700 bg-success-50'
                                        : 'text-danger-700 bg-danger-50'
                                }`}>
                                    {asignatura.activa ? (
                                        <CheckCircle className="h-4 w-4" />
                                    ) : (
                                        <XCircle className="h-4 w-4" />
                                    )}
                                    <span>
                    {asignatura.activa ? t('common.labels.active') : t('common.labels.inactive')}
                  </span>
                                </div>
                            </div>
                            <Card.Title className="text-2xl">{asignatura.nombre}</Card.Title>
                        </div>
                    </div>
                </Card.Header>

                <Card.Content>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Información académica */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {t('subjects.form.academicInfo')}
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <BookOpen className="h-5 w-5 text-primary-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">{t('common.labels.credits')}</p>
                                        <p className="font-medium">{asignatura.creditos}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Clock className="h-5 w-5 text-primary-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Horas Totales</p>
                                        <p className="font-medium">
                                            {(asignatura.horasTeoricas || 0) + (asignatura.horasPracticas || 0)} horas
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Horas Teóricas</p>
                                            <p className="font-medium">{asignatura.horasTeoricas || 0}h</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Horas Prácticas</p>
                                            <p className="font-medium">{asignatura.horasPracticas || 0}h</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Descripción */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {t('common.labels.description')}
                            </h3>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-700">
                                    {asignatura.descripcion || 'Sin descripción disponible'}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card.Content>
            </Card>

            {/* Prerrequisitos */}
            {asignatura.prerrequisitos && asignatura.prerrequisitos.length > 0 && (
                <Card>
                    <Card.Header>
                        <Card.Title>{t('common.labels.prerequisites')}</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {asignatura.prerrequisitos.map((prereq, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3"
                                >
                                    <BookOpen className="h-4 w-4 text-gray-400" />
                                    <div>
                                        <p className="font-medium text-sm">{prereq.nombre}</p>
                                        <p className="text-xs text-gray-500">{prereq.codigo}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card.Content>
                </Card>
            )}

            {/* Horarios */}
            {asignatura.horarios && asignatura.horarios.length > 0 && (
                <Card>
                    <Card.Header>
                        <Card.Title>{t('common.labels.schedule')}</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <div className="space-y-3">
                            {asignatura.horarios.map((horario, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                                >
                                    <div className="flex items-center space-x-3">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                        <div>
                                            <p className="font-medium text-sm">{horario.dia}</p>
                                            <p className="text-xs text-gray-500">
                                                {horario.horaInicio} - {horario.horaFin}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-sm">{horario.aula}</p>
                                        <p className="text-xs text-gray-500">{horario.tipoClase}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card.Content>
                </Card>
            )}
        </div>
    );
};

export default AsignaturaDetail;