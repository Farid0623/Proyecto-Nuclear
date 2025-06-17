import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Edit, Clock, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

const AsignaturaDetail = ({ asignatura, onEdit, onBack }) => {
    const { t } = useTranslation();

    // Validaciones de props con valores por defecto
    const asignaturaData = {
        codigo: asignatura?.codigo || '',
        nombre: asignatura?.nombre || '',
        descripcion: asignatura?.descripcion || '',
        creditos: asignatura?.creditos || 0,
        horasTeoricas: asignatura?.horasTeoricas || 0,
        horasPracticas: asignatura?.horasPracticas || 0,
        activa: asignatura?.activa ?? false,
        prerrequisitos: asignatura?.prerrequisitos || [],
        horarios: asignatura?.horarios || []
    };

    const handleEdit = () => {
        if (onEdit && typeof onEdit === 'function') {
            onEdit();
        }
    };

    const handleBack = () => {
        if (onBack && typeof onBack === 'function') {
            onBack();
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="flex items-center"
                    disabled={!onBack}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('common.actions.back')}
                </Button>

                <Button onClick={handleEdit} disabled={!onEdit}>
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
                                    {asignaturaData.codigo}
                                </span>
                                <div className={`flex items-center space-x-1 text-sm px-3 py-1 rounded-full ${
                                    asignaturaData.activa
                                        ? 'text-success-700 bg-success-50'
                                        : 'text-danger-700 bg-danger-50'
                                }`}>
                                    {asignaturaData.activa ? (
                                        <CheckCircle className="h-4 w-4" />
                                    ) : (
                                        <XCircle className="h-4 w-4" />
                                    )}
                                    <span>
                                        {asignaturaData.activa ? t('common.labels.active') : t('common.labels.inactive')}
                                    </span>
                                </div>
                            </div>
                            <Card.Title className="text-2xl">{asignaturaData.nombre}</Card.Title>
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
                                        <p className="font-medium">{asignaturaData.creditos}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Clock className="h-5 w-5 text-primary-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Horas Totales</p>
                                        <p className="font-medium">
                                            {asignaturaData.horasTeoricas + asignaturaData.horasPracticas} horas
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Horas Teóricas</p>
                                            <p className="font-medium">{asignaturaData.horasTeoricas}h</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Horas Prácticas</p>
                                            <p className="font-medium">{asignaturaData.horasPracticas}h</p>
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
                                    {asignaturaData.descripcion || 'Sin descripción disponible'}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card.Content>
            </Card>

            {/* Prerrequisitos */}
            {asignaturaData.prerrequisitos.length > 0 && (
                <Card>
                    <Card.Header>
                        <Card.Title>{t('common.labels.prerequisites')}</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {asignaturaData.prerrequisitos.map((prereq, index) => (
                                <div
                                    key={prereq.id || index}
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
            {asignaturaData.horarios.length > 0 && (
                <Card>
                    <Card.Header>
                        <Card.Title>{t('common.labels.schedule')}</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <div className="space-y-3">
                            {asignaturaData.horarios.map((horario, index) => (
                                <div
                                    key={horario.id || index}
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

// Definición de PropTypes
AsignaturaDetail.propTypes = {
    asignatura: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        codigo: PropTypes.string,
        nombre: PropTypes.string,
        descripcion: PropTypes.string,
        creditos: PropTypes.number,
        horasTeoricas: PropTypes.number,
        horasPracticas: PropTypes.number,
        activa: PropTypes.bool,
        prerrequisitos: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            codigo: PropTypes.string,
            nombre: PropTypes.string
        })),
        horarios: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            dia: PropTypes.string,
            horaInicio: PropTypes.string,
            horaFin: PropTypes.string,
            aula: PropTypes.string,
            tipoClase: PropTypes.string
        }))
    }).isRequired,
    onEdit: PropTypes.func,
    onBack: PropTypes.func
};

// Valores por defecto
AsignaturaDetail.defaultProps = {
    onEdit: null,
    onBack: null
};

export default AsignaturaDetail;