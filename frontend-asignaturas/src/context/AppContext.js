// src/context/AppContext.js - Con redirección forzada mejorada
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';

// Estado inicial
const initialState = {
    user: {
        id: null,
        nombre: '',
        email: '',
        rol: '',
        isAuthenticated: false,
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
        auth: false,
        asignaturas: false,
        pensum: false,
        horarios: false,
    },
    errors: {},
};

// Tipos de acciones
const actionTypes = {
    SET_USER: 'SET_USER',
    SET_AUTH_STATUS: 'SET_AUTH_STATUS',
    LOGOUT: 'LOGOUT',
    SET_ONLINE_STATUS: 'SET_ONLINE_STATUS',
    UPDATE_LAST_SYNC: 'UPDATE_LAST_SYNC',
    UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
    TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE',
    ADD_NOTIFICATION: 'ADD_NOTIFICATION',
    REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
    CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
    CLEAR_ALL_ERRORS: 'CLEAR_ALL_ERRORS',
};

// Reducer
const appReducer = (state, action) => {
    console.log('🔄 AppContext Reducer:', action.type, action.payload);

    switch (action.type) {
        case actionTypes.SET_USER: {
            const newUserState = {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload,
                    isAuthenticated: true,
                },
            };
            console.log('👤 SET_USER completed:', newUserState.user);

            // Forzar actualización inmediata del DOM
            setTimeout(() => {
                console.log('🔄 Force re-render after SET_USER');
                window.dispatchEvent(new Event('storage'));
            }, 50);

            return newUserState;
        }

        case actionTypes.SET_AUTH_STATUS: {
            const newAuthState = {
                ...state,
                user: {
                    ...state.user,
                    isAuthenticated: action.payload,
                },
            };
            console.log('🔐 SET_AUTH_STATUS:', action.payload);
            return newAuthState;
        }

        case actionTypes.LOGOUT: {
            const logoutState = {
                ...state,
                user: {
                    id: null,
                    nombre: '',
                    email: '',
                    rol: '',
                    isAuthenticated: false,
                },
            };
            console.log('🚪 LOGOUT executed');
            return logoutState;
        }

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

        case actionTypes.UPDATE_PREFERENCES: {
            const updatedPreferences = {
                ...state.preferences,
                ...action.payload,
            };
            try {
                localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
            } catch (error) {
                console.error('Error saving preferences:', error);
            }
            return {
                ...state,
                preferences: updatedPreferences,
            };
        }

        case actionTypes.TOGGLE_DARK_MODE: {
            const newDarkMode = !state.preferences.darkMode;
            const newPreferences = {
                ...state.preferences,
                darkMode: newDarkMode,
            };
            try {
                localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
            } catch (error) {
                console.error('Error saving dark mode preference:', error);
            }
            return {
                ...state,
                preferences: newPreferences,
            };
        }

        case actionTypes.ADD_NOTIFICATION: {
            const notification = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                ...action.payload,
            };
            return {
                ...state,
                notifications: [notification, ...state.notifications].slice(0, 50),
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

        case actionTypes.CLEAR_ERROR: {
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
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Verificar autenticación al iniciar
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('authToken');
            const userData = localStorage.getItem('userData');

            console.log('🔍 Initial auth check:', {
                hasToken: !!token,
                hasUserData: !!userData,
                currentPath: window.location.pathname
            });

            if (token && userData) {
                try {
                    const user = JSON.parse(userData);
                    console.log('✅ Restoring user session:', user);
                    dispatch({ type: actionTypes.SET_USER, payload: user });
                } catch (error) {
                    console.error('❌ Error parsing user data:', error);
                    // Limpiar datos corruptos
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userData');
                    localStorage.removeItem('refreshToken');
                    dispatch({ type: actionTypes.SET_AUTH_STATUS, payload: false });
                }
            } else {
                console.log('❌ No valid session found');
                dispatch({ type: actionTypes.SET_AUTH_STATUS, payload: false });
            }
        };

        checkAuth();

        // Escuchar cambios en localStorage para sincronizar entre pestañas
        const handleStorageChange = () => {
            console.log('📦 Storage change detected, rechecking auth...');
            checkAuth();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Debug del estado con efecto separado
    useEffect(() => {
        console.log('📊 AppContext State Update:', {
            isAuthenticated: state.user.isAuthenticated,
            userName: state.user.nombre,
            hasToken: !!localStorage.getItem('authToken'),
            currentPath: window.location.pathname
        });
    }, [state.user]);

    // Acciones
    const actions = React.useMemo(() => {
        const showNotificationHelper = (message, type = 'info', options = {}) => {
            const notification = {
                message,
                type,
                duration: options.duration || 5000,
                ...options,
            };
            dispatch({ type: actionTypes.ADD_NOTIFICATION, payload: notification });

            if (notification.duration > 0) {
                setTimeout(() => {
                    dispatch({ type: actionTypes.REMOVE_NOTIFICATION, payload: notification.id });
                }, notification.duration);
            }
        };

        return {
            setUser: (userData) => {
                console.log('📝 setUser called with:', userData);
                try {
                    // Guardar en localStorage ANTES de actualizar el estado
                    localStorage.setItem('userData', JSON.stringify(userData));
                    console.log('💾 User data saved to localStorage');

                    // Actualizar el estado
                    dispatch({ type: actionTypes.SET_USER, payload: userData });
                    console.log('🔄 Dispatch SET_USER completed');

                } catch (error) {
                    console.error('❌ Error setting user:', error);
                }
            },

            setAuthStatus: (isAuthenticated) => {
                console.log('🔐 setAuthStatus called with:', isAuthenticated);
                dispatch({ type: actionTypes.SET_AUTH_STATUS, payload: isAuthenticated });
            },

            logout: () => {
                console.log('🚪 logout called');
                try {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('userData');
                    dispatch({ type: actionTypes.LOGOUT });
                    console.log('✅ Logout completed');

                    // Forzar redirección al login
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 100);
                } catch (error) {
                    console.error('❌ Error during logout:', error);
                }
            },

            updatePreferences: (preferences) => {
                dispatch({ type: actionTypes.UPDATE_PREFERENCES, payload: preferences });
            },

            toggleDarkMode: () => {
                dispatch({ type: actionTypes.TOGGLE_DARK_MODE });
            },

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

            setLoading: (key, value) => {
                dispatch({ type: actionTypes.SET_LOADING, payload: { key, value } });
            },

            setError: (key, error) => {
                dispatch({ type: actionTypes.SET_ERROR, payload: { key, error } });
            },

            clearError: (key) => {
                dispatch({ type: actionTypes.CLEAR_ERROR, payload: key });
            },

            clearAllErrors: () => {
                dispatch({ type: actionTypes.CLEAR_ALL_ERRORS });
            },

            updateLastSync: () => {
                dispatch({ type: actionTypes.UPDATE_LAST_SYNC });
            },
        };
    }, []);

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

AppProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default AppContext;