import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HorarioGrid from '../components/horarios/HorarioGrid';
import HorarioForm from '../components/horarios/HorarioForm';
import { useHorarios, useCreateHorario, useUpdateHorario, useWeeklySchedule } from '../hooks/useHorarios';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Card from '../components/common/Card';

const HorariosList = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [selectedHorario, setSelectedHorario] = useState(null);

    const { data: horarios, isLoading } = useWeeklySchedule();
    const createMutation = useCreateHorario();
    const updateMutation = useUpdateHorario();

    const handleAddHorario = () => {
        setSelectedHorario(null);
        setShowForm(true);
    };

    const handleEditHorario = (horario) => {
        setSelectedHorario(horario);
        setShowForm(true);
    };

    const handleSaveHorario = async (data) => {
        try {
            if (selectedHorario) {
                await updateMutation.mutateAsync({ id: selectedHorario.id, data });
            } else {
                await createMutation.mutateAsync(data);
            }
            setShowForm(false);
            setSelectedHorario(null);
        } catch (error) {
            console.error('Error guardando horario:', error);
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setSelectedHorario(null);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" text="Cargando horarios..." />
            </div>
        );
    }

    return (
        <>
            <HorarioGrid
                horarios={horarios || []}
                onAddHorario={handleAddHorario}
                onEditHorario={handleEditHorario}
            />

            {showForm && (
                <HorarioForm
                    horario={selectedHorario}
                    onClose={handleCloseForm}
                    onSave={handleSaveHorario}
                    isLoading={createMutation.isLoading || updateMutation.isLoading}
                />
            )}
        </>
    );
};

const Horarios = () => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <Routes>
                <Route index element={<HorariosList />} />
                <Route path="crear" element={<div>Crear horario</div>} />
                <Route path=":id/editar" element={<div>Editar horario</div>} />
            </Routes>
        </div>
    );
};