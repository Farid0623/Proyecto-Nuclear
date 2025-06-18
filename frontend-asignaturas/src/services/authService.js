import { apiRequest, handleApiResponse, handleApiError } from './api';

const ENDPOINTS = {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
};

export const authService = {
    // Iniciar sesión
    login: async (credentials) => {
        try {
            const response = await apiRequest.post(ENDPOINTS.LOGIN, credentials);
            const data = handleApiResponse(response);

            // Guardar token en localStorage
            if (data.accessToken) {
                localStorage.setItem('authToken', data.accessToken);
            }

            if (data.refreshToken) {
                localStorage.setItem('refreshToken', data.refreshToken);
            }

            return data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Cerrar sesión
    logout: async () => {
        try {
            const response = await apiRequest.post(ENDPOINTS.LOGOUT);

            // Limpiar tokens del localStorage
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('currentUser');

            return handleApiResponse(response);
        } catch (error) {
            // Aunque falle la petición, limpiar datos locales
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('currentUser');

            return handleApiError(error);
        }
    },

    // Refrescar token
    refreshToken: async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await apiRequest.post(ENDPOINTS.REFRESH, {
                refreshToken
            });

            const data = handleApiResponse(response);

            // Actualizar token en localStorage
            if (data.accessToken) {
                localStorage.setItem('authToken', data.accessToken);
            }

            return data;
        } catch (error) {
            // Si falla el refresh, limpiar tokens
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('currentUser');

            return handleApiError(error);
        }
    },

    // Verificar token válido
    verifyToken: async () => {
        try {
            const response = await apiRequest.get(ENDPOINTS.VERIFY);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Obtener perfil del usuario
    getProfile: async () => {
        try {
            const response = await apiRequest.get(ENDPOINTS.PROFILE);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Actualizar perfil
    updateProfile: async (profileData) => {
        try {
            const response = await apiRequest.put(ENDPOINTS.PROFILE, profileData);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Cambiar contraseña
    changePassword: async (passwordData) => {
        try {
            const response = await apiRequest.post(ENDPOINTS.CHANGE_PASSWORD, passwordData);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Solicitar recuperación de contraseña
    forgotPassword: async (email) => {
        try {
            const response = await apiRequest.post(ENDPOINTS.FORGOT_PASSWORD, { email });
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Restablecer contraseña
    resetPassword: async (resetData) => {
        try {
            const response = await apiRequest.post(ENDPOINTS.RESET_PASSWORD, resetData);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Verificar si hay sesión activa
    hasActiveSession: () => {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('currentUser');
        return !!(token && user);
    },

    // Obtener token actual
    getCurrentToken: () => {
        return localStorage.getItem('authToken');
    },

    // Obtener usuario actual del localStorage
    getCurrentUser: () => {
        try {
            const user = localStorage.getItem('currentUser');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error parsing current user:', error);
            return null;
        }
    },

    // Simular login (para desarrollo/demo)
    simulateLogin: async (credentials) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Credenciales de demo
                const validCredentials = [
                    {
                        email: 'admin@cue.edu.co',
                        password: 'admin123',
                        user: {
                            id: 'ADMIN001',
                            nombre: 'Administrador del Sistema',
                            email: 'admin@cue.edu.co',
                            rol: 'administrador'
                        }
                    },
                    {
                        email: 'coordinador@cue.edu.co',
                        password: 'coord123',
                        user: {
                            id: 'COORD001',
                            nombre: 'Coordinador Académico',
                            email: 'coordinador@cue.edu.co',
                            rol: 'coordinador'
                        }
                    }
                ];

                const validUser = validCredentials.find(
                    cred => cred.email === credentials.email && cred.password === credentials.password
                );

                if (validUser) {
                    const mockToken = btoa(JSON.stringify({
                        userId: validUser.user.id,
                        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
                    }));

                    resolve({
                        accessToken: mockToken,
                        refreshToken: `refresh_${mockToken}`,
                        user: validUser.user
                    });
                } else {
                    reject(new Error('Credenciales inválidas'));
                }
            }, 1000); // Simular delay de red
        });
    }
};

export default authService;