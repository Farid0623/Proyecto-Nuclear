import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp debe ser usado dentro de AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: null,
        nombre: '',
        email: '',
        rol: '',
        isAuthenticated: false,
    });

    const [isLoading, setIsLoading] = useState(true);

    // Verificar autenticación al cargar
    useEffect(() => {
        const checkAuth = () => {
            try {
                const token = localStorage.getItem('authToken');
                const userData = localStorage.getItem('userData');

                console.log('🔍 Checking auth:', { hasToken: !!token, hasUserData: !!userData });

                if (token && userData) {
                    const parsedUser = JSON.parse(userData);
                    console.log('✅ Restoring user:', parsedUser);
                    setUser({
                        ...parsedUser,
                        isAuthenticated: true
                    });
                } else {
                    console.log('❌ No session found');
                    setUser(prev => ({ ...prev, isAuthenticated: false }));
                }
            } catch (error) {
                console.error('Error checking auth:', error);
                localStorage.clear();
                setUser(prev => ({ ...prev, isAuthenticated: false }));
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = (userData) => {
        console.log('📝 Login called with:', userData);

        try {
            // Crear token
            const token = `token-${userData.id}-${Date.now()}`;

            // Guardar en localStorage
            localStorage.setItem('authToken', token);
            localStorage.setItem('userData', JSON.stringify(userData));

            // Actualizar estado
            setUser({
                ...userData,
                isAuthenticated: true
            });

            console.log('✅ Login successful');
            return true;
        } catch (error) {
            console.error('❌ Login error:', error);
            return false;
        }
    };

    const logout = () => {
        console.log('🚪 Logout called');

        // Limpiar localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('refreshToken');

        // Limpiar estado
        setUser({
            id: null,
            nombre: '',
            email: '',
            rol: '',
            isAuthenticated: false,
        });
    };

    const isAuthenticated = () => {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        return !!(token && userData && user.isAuthenticated);
    };

    const value = {
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: isAuthenticated(),
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};