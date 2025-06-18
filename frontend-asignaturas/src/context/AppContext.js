import React, { createContext, useContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';

// Estado inicial
const initialState = {
    user: {
        id: 'ADMIN001',
        nombre: 'Administrador del Sistema',
        email: 'admin@cue.edu.co',
        rol: 'administrador',
        isAuthenticated: true,
    },
    system: {
        isOnline: navigator.onLine,
        lastSync: new Date().toISOString(),
        version: '1.0.0',
    },
    preferences: {
        itemsPerPage: 10,
        autoSave: true,
        notifications: true,
        darkMode: false,
    },
    notifications: [],
    loading: {
        global: false,
        asignaturas: false,
        pensum: false,
        horarios: false,
    },
    errors: {},
};

// Tipos de acciones
const actionTypes = {
    // Usuario
    SET_USER: 'SET_USER',
    LOGOUT: 'LOGOUT',

    // Sistema
    SET_ONLINE_STATUS: 'SET_ONLINE_STATUS',
    UPDATE_LAST_SYNC: 'UPDATE_LAST_SYNC',

    // Preferencias
    UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
    TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE',

    // Notificaciones
    ADD_NOTIFICATION: 'ADD_NOTIFICATION',
    REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
    CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',

    // Loading states
    SET_LOADING: 'SET_LOADING',

    // Errores
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
    CLEAR_ALL_ERRORS: 'CLEAR_ALL_ERRORS',
};

// Reducer
const appReducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload,
                    isAuthenticated: true,
                },
            };

        case actionTypes.LOGOUT:
            return {
                ...state,
                user: {
                    ...initialState.user,
                    isAuthenticated: false,
                },
            };

        case actionTypes.SET_ONLINE_STATUS:
            return {
                ...state,
                system: {
                    ...state.system,
                    isOnline: action.payload,
                },
            };

        case actionTypes.UPDATE_LAST_SYNC:
            return {
                ...state,
                system: {
                    ...state.system,
                    lastSync: new Date().toISOString(),
                },
            };

        case actionTypes.UPDATE_PREFERENCES:
        {
            const updatedPreferences = {
                ...state.preferences,
                ...action.payload,
            };
            // Guardar en localStorage
            localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
            return {
                ...state,
                preferences: updatedPreferences,
            };
        }

        case actionTypes.TOGGLE_DARK_MODE:
        {
            const newDarkMode = !state.preferences.darkMode;
            const newPreferences = {
                ...state.preferences,
                darkMode: newDarkMode,
            };
            localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
            return {
                ...state,
                preferences: newPreferences,
            };
        }

        case actionTypes.ADD_NOTIFICATION:
        {
            const notification = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                ...action.payload,
            };
            return {
                ...state,
                notifications: [notification, ...state.notifications].slice(0, 50), // Mantener máximo 50
            };
        }

        case actionTypes.REMOVE_NOTIFICATION:
            return {
                ...state,
                notifications: state.notifications.filter(n => n.id !== action.payload),
            };

        case actionTypes.CLEAR_NOTIFICATIONS:
            return {
                ...state,
                notifications: [],
            };

        case actionTypes.SET_LOADING:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    [action.payload.key]: action.payload.value,
                },
            };

        case actionTypes.SET_ERROR:
            return {
                ...state,
                errors: {
                    ...state.errors,
                    [action.payload.key]: action.payload.error,
                },
            };

        case actionTypes.CLEAR_ERROR:
        {
            const newErrors = { ...state.errors };
            delete newErrors[action.payload];
            return {
                ...state,
                errors: newErrors,
            };
        }

        case actionTypes.CLEAR_ALL_ERRORS:
            return {
                ...state,
                errors: {},
            };

        default:
            return state;
    }
};

// Contexto
const AppContext = createContext();

// Hook para usar el contexto
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp debe ser usado dentro de AppProvider');
    }
    return context;
};

// Provider del contexto
export const AppProvider = ({ children }) => {
    // Cargar preferencias del localStorage
    const loadInitialState = () => {
        try {
            const savedPreferences = localStorage.getItem('userPreferences');
            if (savedPreferences) {
                return {
                    ...initialState,
                    preferences: {
                        ...initialState.preferences,
                        ...JSON.parse(savedPreferences),
                    },
                };
            }
        } catch (error) {
            console.error('Error cargando preferencias:', error);
        }
        return initialState;
    };

    const [state, dispatch] = useReducer(appReducer, loadInitialState());

    // Efectos para sincronización
    useEffect(() => {
        // Escuchar cambios de conectividad
        const handleOnline = () => dispatch({ type: actionTypes.SET_ONLINE_STATUS, payload: true });
        const handleOffline = () => dispatch({ type: actionTypes.SET_ONLINE_STATUS, payload: false });

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Aplicar tema oscuro
    useEffect(() => {
        if (state.preferences.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [state.preferences.darkMode]);

    // Acciones - Usando useCallback para evitar re-creaciones innecesarias
    const actions = React.useMemo(() => {
        // Función helper para mostrar notificaciones
        const showNotificationHelper = (message, type = 'info', options = {}) => {
            const notification = {
                message,
                type,
                duration: options.duration || 5000,
                ...options,
            };
            dispatch({ type: actionTypes.ADD_NOTIFICATION, payload: notification });

            // Auto-remover después del tiempo especificado
            if (notification.duration > 0) {
                setTimeout(() => {
                    dispatch({ type: actionTypes.REMOVE_NOTIFICATION, payload: notification.id });
                }, notification.duration);
            }
        };

        return {
            // Usuario
            setUser: (userData) => {
                dispatch({ type: actionTypes.SET_USER, payload: userData });
            },

            logout: () => {
                localStorage.removeItem('authToken');
                dispatch({ type: actionTypes.LOGOUT });
            },

            // Preferencias
            updatePreferences: (preferences) => {
                dispatch({ type: actionTypes.UPDATE_PREFERENCES, payload: preferences });
            },

            toggleDarkMode: () => {
                dispatch({ type: actionTypes.TOGGLE_DARK_MODE });
            },

            // Notificaciones
            addNotification: (notification) => {
                dispatch({ type: actionTypes.ADD_NOTIFICATION, payload: notification });
            },

            removeNotification: (id) => {
                dispatch({ type: actionTypes.REMOVE_NOTIFICATION, payload: id });
            },

            clearNotifications: () => {
                dispatch({ type: actionTypes.CLEAR_NOTIFICATIONS });
            },

            showNotification: showNotificationHelper,

            // Loading states
            setLoading: (key, value) => {
                dispatch({ type: actionTypes.SET_LOADING, payload: { key, value } });
            },

            // Errores
            setError: (key, error) => {
                dispatch({ type: actionTypes.SET_ERROR, payload: { key, error } });
            },

            clearError: (key) => {
                dispatch({ type: actionTypes.CLEAR_ERROR, payload: key });
            },

            clearAllErrors: () => {
                dispatch({ type: actionTypes.CLEAR_ALL_ERRORS });
            },

            // Sistema
            updateLastSync: () => {
                dispatch({ type: actionTypes.UPDATE_LAST_SYNC });
            },
        };
    }, []); // Sin dependencias porque todas las funciones están bien encapsuladas

    // Helpers útiles
    const helpers = React.useMemo(() => ({
        isLoading: (key) => state.loading[key] || false,
        hasError: (key) => !!state.errors[key],
        getError: (key) => state.errors[key],
        isOnline: () => state.system.isOnline,
        getUnreadNotifications: () => state.notifications.filter(n => !n.read),
    }), [state]);

    const value = React.useMemo(() => ({
        state,
        actions,
        helpers,
        // Propiedades de acceso directo más comunes
        user: state.user,
        preferences: state.preferences,
        notifications: state.notifications,
        isOnline: state.system.isOnline,
    }), [state, actions, helpers]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// PropTypes para AppProvider
AppProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default AppContext;