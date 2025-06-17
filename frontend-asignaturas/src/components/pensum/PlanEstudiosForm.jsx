import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

const PlanEstudiosForm = ({ pensum = null, onClose, onSave, isLoading = false }) => {
    const { t } = useTranslation();

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty }
    } = useForm({
        defaultValues: {
            nombre: pensum?.nombre || '',
            programa: pensum?.programa || '',
            facultad: pensum?.facultad || '',
            duracionSemestres: pensum?.duracionSemestres || 10,
            creditosMinimos: pensum?.creditosMinimos || 140,
            creditosMaximos: pensum?.creditosMaximos || 200,
            modalidad: pensum?.modalidad || 'presencial',
            vigencia: pensum?.vigencia || new Date().getFullYear(),
            activo: pensum?.activo ?? true
        }
    });

    const onSubmit = (data) => {
        onSave(data);
    };

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={pensum ? 'Editar Plan de Estudios' : 'Crear Plan de Estudios'}
            size="lg"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Información básica */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Información Básica
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Nombre del Plan"
                            required
                            {...register('nombre', {
                                required: 'El nombre es obligatorio'
                            })}
                            error={errors.nombre?.message}
                        />

                        <Input
                            label="Programa Académico"
                            required
                            {...register('programa', {
                                required: 'El programa es obligatorio'
                            })}
                            error={errors.programa?.message}
                        />

                        <Input
                            label="Facultad"
                            required
                            {...register('facultad', {
                                required: 'La facultad es obligatoria'
                            })}
                            error={errors.facultad?.message}
                        />

                        <Select
                            label="Modalidad"
                            required
                            {...register('modalidad')}
                        >
                            <option value="presencial">Presencial</option>
                            <option value="virtual">Virtual</option>
                            <option value="mixta">Mixta</option>
                        </Select>
                    </div>
                </div>

                {/* Configuración académica */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Configuración Académica
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="Duración (Semestres)"
                            type="number"
                            min="8"
                            max="12"
                            required
                            {...register('duracionSemestres', {
                                required: 'La duración es obligatoria',
                                min: { value: 8, message: 'Mínimo 8 semestres' },
                                max: { value: 12, message: 'Máximo 12 semestres' }
                            })}
                            error={errors.duracionSemestres?.message}
                        />

                        <Input
                            label="Créditos Mínimos"
                            type="number"
                            min="120"
                            max="200"
                            required
                            {...register('creditosMinimos', {
                                required: 'Los créditos mínimos son obligatorios',
                                min: { value: 120, message: 'Mínimo 120 créditos' }
                            })}
                            error={errors.creditosMinimos?.message}
                        />

                        <Input
                            label="Créditos Máximos"
                            type="number"
                            min="140"
                            max="250"
                            required
                            {...register('creditosMaximos', {
                                required: 'Los créditos máximos son obligatorios',
                                max: { value: 250, message: 'Máximo 250 créditos' }
                            })}
                            error={errors.creditosMaximos?.message}
                        />
                    </div>
                </div>

                {/* Vigencia y estado */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Vigencia y Estado
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Año de Vigencia"
                            type="number"
                            min="2020"
                            max="2030"
                            required
                            {...register('vigencia', {
                                required: 'El año de vigencia es obligatorio'
                            })}
                            error={errors.vigencia?.message}
                        />

                        <div className="flex items-center space-x-2 pt-6">
                            <input
                                type="checkbox"
                                id="activo"
                                {...register('activo')}
                                className="h-4 w-4 text-university-purple focus:ring-university-purple border-gray-300 rounded"
                            />
                            <label htmlFor="activo" className="text-sm text-gray-700">
                                Plan Activo
                            </label>
                        </div>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                    </Button>

                    <Button
                        type="submit"
                        loading={isLoading}
                        disabled={!isDirty}
                        className="btn-university-primary"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Plan
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default PlanEstudiosForm;