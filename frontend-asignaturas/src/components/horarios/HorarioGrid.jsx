import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Calendar, Clock, User, MapPin } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { DIAS_SEMANA, HORAS_ACADEMICAS } from '../../utils/constants';

const HorarioGrid = ({ horarios = [], onAddHorario, onEditHorario, onDeleteHorario }) => {
    const { t } = useTranslation();
    const [selectedWeek, setSelectedWeek] = useState('current');

    const timeSlots = HORAS_ACADEMICAS.slice(0, 12); // 6:00 AM a 6:00 PM

    const getHorarioForCell = (dia, hora) => {
        return horarios.find(h =>
            h.dia === dia &&
            h.horaInicio <= hora &&
            h.horaFin > hora
        );
    };

    const renderHorarioCell = (horario) => {
        if (!horario) return null;

        return (
            <div
                className="p-2 bg-university-purple text-white rounded text-xs cursor-pointer hover:bg-university-purple-dark transition-colors"
                onClick={() => onEditHorario && onEditHorario(horario)}
            >
                <div className="font-medium truncate">{horario.asignatura?.nombre}</div>
                <div className="opacity-80 truncate">{horario.aula}</div>
                <div className="opacity-70">{horario.tipoClase}</div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header con controles */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {t('schedules.weeklySchedule')}
                    </h2>
                    <p className="text-gray-600">
                        Visualización semanal de horarios
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    <select
                        value={selectedWeek}
                        onChange={(e) => setSelectedWeek(e.target.value)}
                        className="form-input text-sm"
                    >
                        <option value="current">Semana Actual</option>
                        <option value="next">Próxima Semana</option>
                        <option value="all">Ver Todo</option>
                    </select>

                    <Button onClick={() => onAddHorario && onAddHorario()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Horario
                    </Button>
                </div>
            </div>

            {/* Grid de horarios */}
            <Card>
                <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                        {/* Header de días */}
                        <div className="grid grid-cols-8 gap-1 mb-2">
                            <div className="p-3 text-center font-medium text-gray-700">
                                Hora
                            </div>
                            {DIAS_SEMANA.map(dia => (
                                <div key={dia.value} className="p-3 text-center font-medium text-gray-700 bg-gray-50 rounded">
                                    <div className="font-semibold">{dia.label}</div>
                                    <div className="text-xs text-gray-500">{dia.short}</div>
                                </div>
                            ))}
                        </div>

                        {/* Grid de horarios */}
                        <div className="space-y-1">
                            {timeSlots.map(slot => (
                                <div key={slot.value} className="grid grid-cols-8 gap-1">
                                    {/* Columna de hora */}
                                    <div className="p-3 text-center text-sm font-medium text-gray-600 bg-gray-50 rounded flex items-center justify-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        {slot.label}
                                    </div>

                                    {/* Columnas de días */}
                                    {DIAS_SEMANA.map(dia => {
                                        const horario = getHorarioForCell(dia.value, slot.value);
                                        return (
                                            <div
                                                key={`${dia.value}-${slot.value}`}
                                                className="p-1 min-h-[60px] border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                                            >
                                                {renderHorarioCell(horario)}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Leyenda */}
            <Card>
                <Card.Header>
                    <Card.Title className="text-sm">Leyenda</Card.Title>
                </Card.Header>
                <Card.Content>
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-university-purple rounded"></div>
                            <span>Clase Teórica</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-university-blue rounded"></div>
                            <span>Clase Práctica</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-success-500 rounded"></div>
                            <span>Laboratorio</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-warning-500 rounded"></div>
                            <span>Seminario</span>
                        </div>
                    </div>
                </Card.Content>
            </Card>
        </div>
    );
};

export default HorarioGrid;