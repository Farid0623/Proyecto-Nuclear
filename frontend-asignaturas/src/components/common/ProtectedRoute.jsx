import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useApp();
    const location = useLocation();

    // Debug
    console.log('🛡️ ProtectedRoute:', {
        isLoading,
        isAuthenticated: user.isAuthenticated,
        hasToken: !!localStorage.getItem('authToken'),
        path: location.pathname
    });

    // Mostrar loading mientras se verifica
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center shadow-lg">
                        <span className="text-blue-600 font-bold text-2xl">AH</span>
                    </div>
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-primary-600 font-medium">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    // Si no está autenticado, redirigir al login
    if (!user.isAuthenticated) {
        console.log('❌ Not authenticated, redirecting to login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Debug visual en desarrollo
    if (process.env.NODE_ENV === 'development') {
        return (
            <div>
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    background: user.isAuthenticated ? 'green' : 'red',
                    color: 'white',
                    padding: '5px 10px',
                    zIndex: 9999,
                    fontSize: '12px',
                    textAlign: 'center'
                }}>
                    🛡️ Auth: {user.isAuthenticated ? 'YES' : 'NO'} | User: {user.nombre || 'None'} | Path: {location.pathname}
                </div>
                <div style={{ paddingTop: '30px' }}>
                    {children}
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;