// src/services/api.js - Versión corregida
import axios from 'axios';
import toast from 'react-hot-toast';

// Configuración de la API
const API_CONFIG = {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
    timeout: 15000,
    retries: 3,
    retryDelay: 1000,
};

// Crear instancia principal de axios
const api = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Estado de la aplicación
let isRefreshing = false;
let failedQueue = [];

// Función para procesar cola de requests fallidos
const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });

    failedQueue = [];
};

// Interceptor para requests - Agregar autenticación
api.interceptors.request.use(
    (config) => {
        // Agregar token JWT si existe
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Agregar timestamp para evitar cache
        if (config.method === 'get') {
            config.params = {
                ...config.params,
                _t: Date.now()
            };
        }

        // Log en desarrollo
        if (process.env.NODE_ENV === 'development') {
            console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
                headers: config.headers,
                data: config.data,
                params: config.params
            });
        }

        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Interceptor para responses - Manejo de errores y token refresh
api.interceptors.response.use(
    (response) => {
        // Log en desarrollo
        if (process.env.NODE_ENV === 'development') {
            console.log(`✅ API Response: ${response.status} ${response.config.url}`, response.data);
        }

        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Error de red
        if (!error.response) {
            console.error('❌ Network Error:', error.message);
            toast.error('Error de conexión. Verifica tu internet.');
            return Promise.reject(error);
        }

        const { status, data } = error.response;

        // Manejo de token expirado (401)
        if (status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Si ya se está refrescando, agregar a la cola
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch((err) => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await api.post('/auth/refresh', {
                        refreshToken
                    });

                    const { accessToken } = response.data;
                    localStorage.setItem('authToken', accessToken);

                    processQueue(null, accessToken);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                processQueue(refreshError, null);

                // Limpiar tokens y redirigir al login
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Manejo específico de errores por código
        const errorMessage = handleErrorResponse(status, data);

        // Solo mostrar toast para errores que no sean de validación
        if (status !== 422 && status !== 400) {
            toast.error(errorMessage);
        }

        console.error(`❌ API Error: ${status}`, {
            url: error.config?.url,
            method: error.config?.method,
            data: data,
            message: errorMessage
        });

        return Promise.reject(error);
    }
);

// Función para manejar respuestas de error
const handleErrorResponse = (status, data) => {
    const defaultMessages = {
        400: 'Solicitud inválida',
        401: 'No autorizado',
        403: 'Acceso prohibido',
        404: 'Recurso no encontrado',
        409: 'Conflicto de datos',
        422: 'Error de validación',
        429: 'Demasiadas solicitudes',
        500: 'Error interno del servidor',
        502: 'Servidor no disponible',
        503: 'Servicio no disponible',
        504: 'Tiempo de espera agotado'
    };

    // Usar mensaje del servidor si está disponible
    if (data?.message) {
        return data.message;
    }

    // Usar mensaje por defecto según el código
    return defaultMessages[status] || `Error ${status}`;
};

// Función helper para construir query parameters
export const buildQueryParams = (params) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            if (Array.isArray(value)) {
                value.forEach(item => searchParams.append(key, item));
            } else {
                searchParams.append(key, value.toString());
            }
        }
    });

    return searchParams.toString();
};

// Función para hacer requests con retry automático
const requestWithRetry = async (requestFn, retries = API_CONFIG.retries) => {
    for (let i = 0; i <= retries; i++) {
        try {
            return await requestFn();
        } catch (error) {
            if (i === retries) {
                throw error;
            }

            // Solo reintentar en errores de red o 5xx
            if (!error.response || error.response.status >= 500) {
                const delay = API_CONFIG.retryDelay * Math.pow(2, i); // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            throw error;
        }
    }
};

// API helper functions
export const apiHelper = {
    get: (url, config = {}) => requestWithRetry(() => api.get(url, config)),
    post: (url, data = {}, config = {}) => requestWithRetry(() => api.post(url, data, config)),
    put: (url, data = {}, config = {}) => requestWithRetry(() => api.put(url, data, config)),
    patch: (url, data = {}, config = {}) => requestWithRetry(() => api.patch(url, data, config)),
    delete: (url, config = {}) => requestWithRetry(() => api.delete(url, config)),
};

// Función adicional para mejor compatibilidad
export const apiRequest = apiHelper;

// Función para manejar respuesta de API
export const handleApiResponse = (response) => {
    return response.data;
};

// Función para manejar errores de API
export const handleApiError = (error) => {
    console.error('API Error:', error);
    throw error;
};

// Función para verificar salud del API
export const checkApiHealth = async () => {
    try {
        const response = await api.get('/health', { timeout: 5000 });
        return {
            isHealthy: response.status === 200,
            responseTime: response.headers['x-response-time'] || 'unknown'
        };
    } catch (error) {
        return {
            isHealthy: false,
            error: error.message
        };
    }
};

// Función para configurar interceptors personalizados
export const addRequestInterceptor = (onFulfilled, onRejected) => {
    return api.interceptors.request.use(onFulfilled, onRejected);
};

export const addResponseInterceptor = (onFulfilled, onRejected) => {
    return api.interceptors.response.use(onFulfilled, onRejected);
};

// Funciones para manejo de autenticación
export const authAPI = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        const { accessToken, refreshToken, user } = response.data;

        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        return { user, accessToken };
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
        }
    },

    refreshToken: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await api.post('/auth/refresh', { refreshToken });
        const { accessToken } = response.data;

        localStorage.setItem('authToken', accessToken);
        return accessToken;
    }
};

// Export de la instancia principal
export default api;

// Export de configuración para testing
export { API_CONFIG };