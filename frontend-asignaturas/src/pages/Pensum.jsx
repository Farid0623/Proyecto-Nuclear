import React from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route } from 'react-router-dom';
import PensumView from '../components/pensum/PensumView';

const Pensum = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gray-50">
            <Routes>
                <Route index element={<PensumView />} />
                <Route path="crear" element={<div>Crear plan de estudios</div>} />
                <Route path=":id/editar" element={<div>Editar plan de estudios</div>} />
            </Routes>
        </div>
    );
};

export default Pensum;