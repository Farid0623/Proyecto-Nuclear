import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import LoadingSpinner from '../common/LoadingSpinner';

const AuthGuard = ({ children }) => {
    const { user, actions } = useApp();
    const location = useLocation();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const savedUser = localStorage.getItem('currentUser');

                if (token && savedUser) {
                    try {
                        // Verificar si el token es válido (simulación básica)
                        const tokenData = JSON.parse(atob(token.split('.')[0] || token));
                        const isExpired = tokenData.exp && tokenData.exp < Date.now();

                        if (!isExpired) {
                            const parsedUser = JSON.parse(savedUser);
                            actions.setUser(parsedUser);
                        } else {
                            // Token expirado
                            localStorage.removeItem('authToken');
                            localStorage.removeItem('currentUser');
                            localStorage.removeItem('refreshToken');
                        }
                    } catch (error) {
                        // Token inválido
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('currentUser');
                        localStorage.removeItem('refreshToken');
                    }
                }
            } catch (error) {
                console.error('Error checking auth:', error);
            } finally {
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [actions]);

    // Mostrar spinner mientras se verifica la autenticación
    if (isChecking) {
        return (
            <div className="min-h-screen bg-primary-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="institutional-logo-icon mx-auto mb-4">
                        <span>AH</span>
                    </div>
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-primary-600 font-medium">Verificando autenticación...</p>
                </div>
            </div>
        );
    }

    // Si no está autenticado, redirigir al login
    if (!user.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Si está autenticado, mostrar el contenido
    return children;
};

export default AuthGuard;