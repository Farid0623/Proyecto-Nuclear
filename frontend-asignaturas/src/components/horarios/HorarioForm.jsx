import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Save, X, Clock, User } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { DIAS_SEMANA, TIPOS_CLASE, HORAS_ACADEMICAS } from '../../utils/constants';
import { useAsignaturasActivas } from '../../hooks/useAsignaturas';

const HorarioForm = ({
                         horario = null,
                         onClose,
                         onSave,
                         isLoading = false
                     }) => {
    const { t } = useTranslation();
    const { data: asignaturas } = useAsignaturasActivas();

    const horarioData = horario ? {
        asignaturaId: horario.asignaturaId || '',
        dia: horario.dia || '',
        horaInicio: horario.horaInicio || '',
        horaFin: horario.horaFin || '',
        aula: horario.aula || '',
        tipoClase: horario.tipoClase || 'TEORICA',
        profesorId: horario.profesorId || '',
        capacidad: horario.capacidad || 30,
        activo: horario.activo ?? true
    } : {
        asignaturaId: '',
        dia: '',
        horaInicio: '',
        horaFin: '',
        aula: '',
        tipoClase: 'TEORICA',
        profesorId: '',
        capacidad: 30,
        activo: true
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isDirty }
    } = useForm({
        defaultValues: horarioData
    });

    const watchHoraInicio = watch('horaInicio');

    const handleFormSubmit = (data) => {
        // Validar que hora fin sea posterior a hora inicio
        if (data.horaFin <= data.horaInicio) {
            return;
        }

        if (onSave && typeof onSave === 'function') {
            onSave(data);
        }
    };

    const handleClose = () => {
        if (onClose && typeof onClose === 'function') {
            onClose();
        }
    };

    // Filtrar horas de fin disponibles
    const getAvailableEndTimes = () => {
        if (!watchHoraInicio) return HORAS_ACADEMICAS;

        const startIndex = HORAS_ACADEMICAS.findIndex(h => h.value === watchHoraInicio);
        return HORAS_ACADEMICAS.slice(startIndex + 1);
    };

    return (
        <Modal
            isOpen={true}
            onClose={handleClose}
            title={horario ? t('schedules.editSchedule') : t('schedules.createSchedule')}
            size="lg"
        >
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                {/* Información básica */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Información del Horario
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label="Asignatura"
                            required
                            {...register('asignaturaId', {
                                required: 'La asignatura es obligatoria'
                            })}
                            error={errors.asignaturaId?.message}
                        >
                            <option value="">Seleccionar asignatura</option>
                            {(asignaturas || []).map(asignatura => (
                                <option key={asignatura.id} value={asignatura.id}>
                                    {asignatura.codigo} - {asignatura.nombre}
                                </option>
                            ))}
                        </Select>

                        <Select
                            label="Tipo de Clase"
                            required
                            {...register('tipoClase')}
                        >
                            {TIPOS_CLASE.map(tipo => (
                                <option key={tipo.value} value={tipo.value}>
                                    {tipo.label}
                                </option>
                            ))}
                        </Select>
                    </div>
                </div>

                {/* Tiempo y lugar */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        <Clock className="h-5 w-5 inline mr-2 text-university-purple" />
                        Tiempo y Ubicación
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label={t('common.labels.day')}
                            required
                            {...register('dia', {
                                required: 'El día es obligatorio'
                            })}
                            error={errors.dia?.message}
                        >
                            <option value="">Seleccionar día</option>
                            {DIAS_SEMANA.map(dia => (
                                <option key={dia.value} value={dia.value}>
                                    {dia.label}
                                </option>
                            ))}
                        </Select>

                        <Input
                            label="Aula"
                            required
                            {...register('aula', {
                                required: 'El aula es obligatoria'
                            })}
                            error={errors.aula?.message}
                            placeholder="Ej: A101, Lab-001"
                        />

                        <Select
                            label={t('common.labels.startTime')}
                            required
                            {...register('horaInicio', {
                                required: 'La hora de inicio es obligatoria'
                            })}
                            error={errors.horaInicio?.message}
                        >
                            <option value="">Seleccionar hora</option>
                            {HORAS_ACADEMICAS.map(hora => (
                                <option key={hora.value} value={hora.value}>
                                    {hora.label}
                                </option>
                            ))}
                        </Select>

                        <Select
                            label={t('common.labels.endTime')}
                            required
                            {...register('horaFin', {
                                required: 'La hora de fin es obligatoria'
                            })}
                            error={errors.horaFin?.message}
                        >
                            <option value="">Seleccionar hora</option>
                            {getAvailableEndTimes().map(hora => (
                                <option key={hora.value} value={hora.value}>
                                    {hora.label}
                                </option>
                            ))}
                        </Select>
                    </div>
                </div>

                {/* Información adicional */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        <User className="h-5 w-5 inline mr-2 text-university-purple" />
                        Información Adicional
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="ID del Profesor"
                            {...register('profesorId')}
                            placeholder="Código del profesor"
                        />

                        <Input
                            label="Capacidad del Aula"
                            type="number"
                            min="1"
                            max="100"
                            {...register('capacidad', {
                                min: { value: 1, message: 'Mínimo 1 estudiante' },
                                max: { value: 100, message: 'Máximo 100 estudiantes' }
                            })}
                            error={errors.capacidad?.message}
                        />
                    </div>

                    <div className="mt-4">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="activo"
                                {...register('activo')}
                                className="h-4 w-4 text-university-purple focus:ring-university-purple border-gray-300 rounded"
                            />
                            <label htmlFor="activo" className="text-sm text-gray-700">
                                Horario Activo
                            </label>
                        </div>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        <X className="h-4 w-4 mr-2" />
                        {t('common.actions.cancel')}
                    </Button>

                    <Button
                        type="submit"
                        loading={isLoading}
                        disabled={!isDirty}
                        className="btn-university-primary"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {t('common.actions.save')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

HorarioForm.propTypes = {
    horario: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        asignaturaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        dia: PropTypes.string,
        horaInicio: PropTypes.string,
        horaFin: PropTypes.string,
        aula: PropTypes.string,
        tipoClase: PropTypes.string,
        profesorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        capacidad: PropTypes.number,
        activo: PropTypes.bool
    }),
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    isLoading: PropTypes.bool
};

HorarioForm.defaultProps = {
    horario: null,
    isLoading: false
};

export default HorarioForm;