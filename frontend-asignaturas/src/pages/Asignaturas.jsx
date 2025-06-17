import React, { useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AsignaturaList from '../components/asignaturas/AsignaturaList';
import AsignaturaForm from '../components/asignaturas/AsignaturaForm';
import AsignaturaDetail from '../components/asignaturas/AsignaturaDetail';
import { useCreateAsignatura, useUpdateAsignatura, useAsignatura } from '../hooks/useAsignaturas';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Componente para crear asignatura
const CreateAsignatura = () => {
    const navigate = useNavigate();
    const createMutation = useCreateAsignatura();

    const handleSave = async (data) => {
        try {
            await createMutation.mutateAsync(data);
            navigate('/asignaturas');
        } catch (error) {
            console.error('Error creando asignatura:', error);
        }
    };

    const handleCancel = () => {
        navigate('/asignaturas');
    };

    return (
        <AsignaturaForm
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={createMutation.isLoading}
        />
    );
};

// Componente para editar asignatura
const EditAsignatura = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: asignatura, isLoading: loadingAsignatura } = useAsignatura(id);
    const updateMutation = useUpdateAsignatura();

    const handleSave = async (data) => {
        try {
            await updateMutation.mutateAsync({ id, data });
            navigate('/asignaturas');
        } catch (error) {
            console.error('Error actualizando asignatura:', error);
        }
    };

    const handleCancel = () => {
        navigate('/asignaturas');
    };

    if (loadingAsignatura) {
        return (
            <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!asignatura) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Asignatura no encontrada</p>
            </div>
        );
    }

    return (
        <AsignaturaForm
            asignatura={asignatura}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={updateMutation.isLoading}
        />
    );
};

// Componente para ver detalles de asignatura
const ViewAsignatura = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: asignatura, isLoading } = useAsignatura(id);

    const handleEdit = () => {
        navigate(`/asignaturas/${id}/editar`);
    };

    const handleBack = () => {
        navigate('/asignaturas');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!asignatura) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Asignatura no encontrada</p>
            </div>
        );
    }

    return (
        <AsignaturaDetail
            asignatura={asignatura}
            onEdit={handleEdit}
            onBack={handleBack}
        />
    );
};

// Componente principal de la página de asignaturas
const Asignaturas = () => {
    const navigate = useNavigate();

    const handleCreateNew = () => {
        navigate('/asignaturas/crear');
    };

    const handleEdit = (asignatura) => {
        navigate(`/asignaturas/${asignatura.id}/editar`);
    };

    const handleView = (asignatura) => {
        navigate(`/asignaturas/${asignatura.id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Routes>
                {/* Lista principal de asignaturas */}
                <Route
                    index
                    element={
                        <AsignaturaList
                            onCreateNew={handleCreateNew}
                            onEdit={handleEdit}
                            onView={handleView}
                        />
                    }
                />

                {/* Crear nueva asignatura */}
                <Route path="crear" element={<CreateAsignatura />} />

                {/* Editar asignatura */}
                <Route path=":id/editar" element={<EditAsignatura />} />

                {/* Ver detalles de asignatura */}
                <Route path=":id" element={<ViewAsignatura />} />
            </Routes>
        </div>
    );
};

export default Asignaturas;