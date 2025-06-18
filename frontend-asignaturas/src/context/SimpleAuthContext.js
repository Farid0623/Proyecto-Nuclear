import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Contexto de autenticación
const SimpleAuthContext = createContext();

// Hook para usar el contexto
export const useSimpleAuth = () => {
    const context = useContext(SimpleAuthContext);
    if (!context) {
        throw new Error('useSimpleAuth must be used within SimpleAuthProvider');
    }
    return context;
};

// Hook personalizado para manejar autenticación
const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    const checkAuth = () => {
        const token = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('currentUser');

        if (token && savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                setIsAuthenticated(true);
                return true;
            } catch (error) {
                console.error('Error parsing user:', error);
                clearAuth();
                return false;
            }
        }
        return false;
    };

    const login = (userData, token) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        clearAuth();
    };

    const clearAuth = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setIsAuthenticated(false);
    };

    useEffect(() => {
        checkAuth();
        setIsLoading(false);
    }, []);

    return {
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        checkAuth
    };
};

// Provider del contexto
export const SimpleAuthProvider = ({ children }) => {
    const auth = useAuth();

    return (
        <SimpleAuthContext.Provider value={auth}>
            {children}
        </SimpleAuthContext.Provider>
    );
};

SimpleAuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default SimpleAuthContext;