import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Save, X, AlertCircle } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import { useValidation } from '../../hooks/useValidation';

const AsignaturaForm = ({
                            asignatura = null,
                            onSave,
                            onCancel,
                            isLoading = false
                        }) => {
    const { t } = useTranslation();
    const { validateAsignatura } = useValidation();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isDirty },
        reset
    } = useForm({
        defaultValues: {
            codigo: asignatura?.codigo || '',
            nombre: asignatura?.nombre || '',
            descripcion: asignatura?.descripcion || '',
            creditos: asignatura?.creditos || 1,
            horasTeoricas: asignatura?.horasTeoricas || 16,
            horasPracticas: asignatura?.horasPracticas || 0,
            activa: asignatura?.activa ?? true
        }
    });

    const watchedCreditos = watch('creditos');
    const watchedHorasTeoricas = watch('horasTeoricas');
    const watchedHorasPracticas = watch('horasPracticas');

    // Auto-calcular horas cuando cambian los créditos
    useEffect(() => {
        if (watchedCreditos && !asignatura) {
            const totalHoras = watchedCreditos * 16;
            setValue('horasTeoricas', Math.round(totalHoras * 0.75));
            setValue('horasPracticas', Math.round(totalHoras * 0.25));
        }
    }, [watchedCreditos, setValue, asignatura]);

    // Validación en tiempo real de consistencia de horas
    const horasConsistentes = () => {
        const creditos = parseInt(watchedCreditos) || 0;
        const teoricas = parseInt(watchedHorasTeoricas) || 0;
        const practicas = parseInt(watchedHorasPracticas) || 0;
        return (teoricas + practicas) === (creditos * 16);
    };

    const onSubmit = async (data) => {
        try {
            // Validar datos usando el servicio de validación
            const validationResult = await validateAsignatura(data);

            if (!validationResult.esValido) {
                // Mostrar errores de validación
                Object.entries(validationResult.errores).forEach(([field, message]) => {
                    // Aquí podrías mostrar errores específicos
                    console.error(`${field}: ${message}`);
                });
                return;
            }

            await onSave(data);
        } catch (error) {
            console.error('Error al guardar asignatura:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <Card.Header>
                    <Card.Title>
                        {asignatura
                            ? t('subjects.editSubject')
                            : t('subjects.createSubject')
                        }
                    </Card.Title>
                </Card.Header>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Información Básica */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {t('subjects.form.basicInfo')}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label={t('common.labels.code')}
                                required
                                {...register('codigo', {
                                    required: t('common.validation.required'),
                                    pattern: {
                                        value: /^[A-Za-z0-9]{3,10}$/,
                                        message: t('subjects.validation.invalidCode')
                                    }
                                })}
                                error={errors.codigo?.message}
                                helpText={t('subjects.form.codeHelp')}
                                disabled={!!asignatura} // No permitir editar código en modo edición
                            />

                            <Input
                                label={t('common.labels.name')}
                                required
                                {...register('nombre', {
                                    required: t('common.validation.required'),
                                    minLength: {
                                        value: 3,
                                        message: t('common.validation.minLength', { count: 3 })
                                    }
                                })}
                                error={errors.nombre?.message}
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('common.labels.description')}
                            </label>
                            <textarea
                                rows={3}
                                {...register('descripcion')}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                placeholder={`${t('common.labels.description')}...`}
                            />
                        </div>
                    </div>

                    {/* Información Académica */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {t('subjects.form.academicInfo')}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label={t('common.labels.credits')}
                                type="number"
                                min="1"
                                max="10"
                                required
                                {...register('creditos', {
                                    required: t('common.validation.required'),
                                    min: {
                                        value: 1,
                                        message: t('common.validation.positive')
                                    },
                                    max: {
                                        value: 10,
                                        message: t('subjects.validation.invalidCredits')
                                    }
                                })}
                                error={errors.creditos?.message}
                                helpText={t('subjects.form.creditsHelp')}
                            />

                            <Input
                                label={t('common.labels.theoreticalHours')}
                                type="number"
                                min="0"
                                required
                                {...register('horasTeoricas', {
                                    required: t('common.validation.required'),
                                    min: {
                                        value: 0,
                                        message: 'Las horas no pueden ser negativas'
                                    }
                                })}
                                error={errors.horasTeoricas?.message}
                            />

                            <Input
                                label={t('common.labels.practicalHours')}
                                type="number"
                                min="0"
                                required
                                {...register('horasPracticas', {
                                    required: t('common.validation.required'),
                                    min: {
                                        value: 0,
                                        message: 'Las horas no pueden ser negativas'
                                    }
                                })}
                                error={errors.horasPracticas?.message}
                            />
                        </div>

                        {/* Validación de consistencia de horas */}
                        {!horasConsistentes() && watchedCreditos && (
                            <div className="mt-3 p-3 bg-warning-50 border border-warning-200 rounded-md">
                                <div className="flex">
                                    <AlertCircle className="h-5 w-5 text-warning-400 mt-0.5" />
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-warning-800">
                                            Inconsistencia en horas
                                        </h3>
                                        <div className="mt-1 text-sm text-warning-700">
                                            <p>{t('common.validation.hoursConsistency')}</p>
                                            <p className="mt-1">
                                                Actual: {(parseInt(watchedHorasTeoricas) || 0) + (parseInt(watchedHorasPracticas) || 0)} horas
                                                | Esperado: {(parseInt(watchedCreditos) || 0) * 16} horas
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Estado */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Estado de la Asignatura
                        </h3>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="activa"
                                {...register('activa')}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <label htmlFor="activa" className="ml-2 block text-sm text-gray-700">
                                {t('common.labels.active')}
                            </label>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <Card.Footer>
                        <div className="flex justify-end space-x-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={isLoading}
                            >
                                <X className="h-4 w-4 mr-2" />
                                {t('common.actions.cancel')}
                            </Button>

                            <Button
                                type="submit"
                                loading={isLoading}
                                disabled={!isDirty || !horasConsistentes()}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {t('common.actions.save')}
                            </Button>
                        </div>
                    </Card.Footer>
                </form>
            </Card>
        </div>
    );
};

export default AsignaturaForm;