// src/components/auth/AuthInitializer.jsx - Componente helper para autenticación
import React from 'react';
import { useApp } from '../../context/AppContext';
import LoadingSpinner from '../common/LoadingSpinner';

const AuthInitializer = ({ children }) => {
    const { helpers } = useApp();

    // Mostrar loading mientras se inicializa la autenticación
    if (!helpers.isInitialized()) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-xl flex items-center justify-center shadow-2xl">
                        <span className="text-blue-600 font-bold text-3xl">AH</span>
                    </div>
                    <LoadingSpinner size="lg" color="white" />
                    <p className="mt-6 text-white font-semibold text-lg drop-shadow-lg">
                        Inicializando Sistema
                    </p>
                    <p className="mt-2 text-white/80 text-sm drop-shadow">
                        Universidad Alexander von Humboldt
                    </p>
                    <div className="mt-4 text-white/60 text-xs">
                        Verificando autenticación...
                    </div>
                </div>
            </div>
        );
    }

    return children;
};

export default AuthInitializer;