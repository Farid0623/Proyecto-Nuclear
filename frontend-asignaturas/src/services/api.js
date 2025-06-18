import axios from 'axios';
import toast from 'react-hot-toast';
import mockBackendService from './mockBackendService';

// Configuración de la API
const API_CONFIG = {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
    timeout: 15000,
    retries: 3,
    retryDelay: 1000,
    useMockFallback: process.env.NODE_ENV === 'development', // Usar mock en desarrollo si no hay backend
};

// Variable para controlar si se debe usar el mock
let useMockService = false;

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

// Función para verificar si el backend está disponible
const checkBackendAvailability = async () => {
    try {
        await axios.get(`${API_CONFIG.baseURL}/health`, { timeout: 5000 });
        return true;
    } catch (error) {
        console.warn('⚠️ Backend no disponible, usando servicio mock');
        return false;
    }
};

// Inicializar verificación de backend
if (API_CONFIG.useMockFallback) {
    checkBackendAvailability().then(isAvailable => {
        useMockService = !isAvailable;
        if (useMockService) {
            toast.success('🔧 Modo desarrollo: Usando datos mock', {
                duration: 3000,
                style: { background: '#3b82f6', color: 'white' }
            });
        }
    });
}

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

        // Si no hay respuesta, probablemente no hay backend
        if (!error.response && API_CONFIG.useMockFallback) {
            console.warn('⚠️ No response from backend, switching to mock service');
            useMockService = true;

            // Reintentar con mock service
            return handleMockRequest(originalRequest);
        }

        // Si hay respuesta, manejar normalmente
        if (error.response) {
            const { status, data } = error.response;

            // Manejo de token expirado (401)
            if (status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
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
                        const response = await api.post('/auth/refresh', { refreshToken });
                        const { accessToken } = response.data;
                        localStorage.setItem('authToken', accessToken);
                        processQueue(null, accessToken);
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    processQueue(refreshError, null);
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
        }

        return Promise.reject(error);
    }
);

// Función para manejar requests con mock service
const handleMockRequest = async (config) => {
    try {
        const { method, url, data } = config;
        const endpoint = url.replace(API_CONFIG.baseURL, '').replace('/api', '');

        let result;

        // Mapear endpoints a métodos del mock service
        if (endpoint.includes('/auth/login')) {
            result = await mockBackendService.login(data);
        } else if (endpoint.includes('/auth/logout')) {
            result = await mockBackendService.logout();
        } else if (endpoint.includes('/auth/refresh')) {
            result = await mockBackendService.refreshToken();
        } else if (endpoint.includes('/asignaturas/activas')) {
            result = await mockBackendService.getAsignaturasActivas();
        } else if (endpoint.includes('/asignaturas/estadisticas')) {
            result = await mockBackendService.getAsignaturasEstadisticas();
        } else if (endpoint.includes('/asignaturas') && method === 'get') {
            if (endpoint.includes('/asignaturas/')) {
                const id = endpoint.split('/').pop();
                result = await mockBackendService.getAsignaturaById(id);
            } else {
                result = await mockBackendService.getAsignaturas(config.params);
            }
        } else if (endpoint.includes('/asignaturas') && method === 'post') {
            result = await mockBackendService.createAsignatura(data);
        } else if (endpoint.includes('/asignaturas') && method === 'put') {
            const id = endpoint.split('/').pop();
            result = await mockBackendService.updateAsignatura(id, data);
        } else if (endpoint.includes('/asignaturas') && method === 'delete') {
            const id = endpoint.split('/').pop();
            result = await mockBackendService.deleteAsignatura(id);
        } else if (endpoint.includes('/horarios/semanal')) {
            result = await mockBackendService.getWeeklySchedule(config.params);
        } else if (endpoint.includes('/horarios') && method === 'get') {
            result = await mockBackendService.getHorarios(config.params);
        } else if (endpoint.includes('/horarios') && method === 'post') {
            result = await mockBackendService.createHorario(data);
        } else if (endpoint.includes('/planes-estudio')) {
            result = await mockBackendService.getPlanesEstudio();
        } else if (endpoint.includes('/malla-curricular')) {
            const planId = endpoint.split('/').pop();
            result = await mockBackendService.getMallaCurricular(planId);
        } else if (endpoint.includes('/pensum/estadisticas')) {
            const planId = endpoint.split('/').pop();
            result = await mockBackendService.getEstadisticasPensum(planId);
        } else if (endpoint.includes('/health')) {
            result = await mockBackendService.checkHealth();
        } else {
            throw new Error(`Endpoint no implementado en mock: ${endpoint}`);
        }

        // Simular respuesta de axios
        return {
            data: result,
            status: 200,
            statusText: 'OK',
            headers: {},
            config
        };
    } catch (error) {
        // Simular error de axios
        throw {
            response: {
                data: { message: error.message },
                status: 400,
                statusText: 'Bad Request'
            },
            config
        };
    }
};

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

    if (data?.message) {
        return data.message;
    }

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

// Función para hacer requests con retry automático y fallback a mock
const requestWithRetry = async (requestFn, retries = API_CONFIG.retries) => {
    for (let i = 0; i <= retries; i++) {
        try {
            return await requestFn();
        } catch (error) {
            // Si es el último intento y hay fallback disponible, usar mock
            if (i === retries && !error.response && API_CONFIG.useMockFallback) {
                console.warn('⚠️ All retries failed, using mock service');
                useMockService = true;
                return await requestFn();
            }

            if (i === retries) {
                throw error;
            }

            // Solo reintentar en errores de red o 5xx
            if (!error.response || error.response.status >= 500) {
                const delay = API_CONFIG.retryDelay * Math.pow(2, i);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            throw error;
        }
    }
};

// API helper functions con detección automática de mock
export const apiHelper = {
    get: (url, config = {}) => requestWithRetry(async () => {
        if (useMockService) {
            return handleMockRequest({ ...config, method: 'get', url });
        }
        return api.get(url, config);
    }),

    post: (url, data = {}, config = {}) => requestWithRetry(async () => {
        if (useMockService) {
            return handleMockRequest({ ...config, method: 'post', url, data });
        }
        return api.post(url, data, config);
    }),

    put: (url, data = {}, config = {}) => requestWithRetry(async () => {
        if (useMockService) {
            return handleMockRequest({ ...config, method: 'put', url, data });
        }
        return api.put(url, data, config);
    }),

    patch: (url, data = {}, config = {}) => requestWithRetry(async () => {
        if (useMockService) {
            return handleMockRequest({ ...config, method: 'patch', url, data });
        }
        return api.patch(url, data, config);
    }),

    delete: (url, config = {}) => requestWithRetry(async () => {
        if (useMockService) {
            return handleMockRequest({ ...config, method: 'delete', url });
        }
        return api.delete(url, config);
    }),
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
        let response;
        if (useMockService) {
            response = await mockBackendService.checkHealth();
            return { isHealthy: true, responseTime: '200ms', service: 'mock' };
        } else {
            response = await api.get('/health', { timeout: 5000 });
            return {
                isHealthy: response.status === 200,
                responseTime: response.headers['x-response-time'] || 'unknown',
                service: 'backend'
            };
        }
    } catch (error) {
        return {
            isHealthy: false,
            error: error.message,
            service: useMockService ? 'mock' : 'backend'
        };
    }
};

// Funciones para manejo de autenticación
export const authAPI = {
    login: async (credentials) => {
        try {
            let response;
            if (useMockService) {
                const result = await mockBackendService.login(credentials);
                response = { data: result };
            } else {
                response = await api.post('/auth/login', credentials);
            }

            const { accessToken, refreshToken, user } = response.data;

            localStorage.setItem('authToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            return { user, accessToken };
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        try {
            if (useMockService) {
                await mockBackendService.logout();
            } else {
                await api.post('/auth/logout');
            }
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

        let response;
        if (useMockService) {
            const result = await mockBackendService.refreshToken();
            response = { data: result };
        } else {
            response = await api.post('/auth/refresh', { refreshToken });
        }

        const { accessToken } = response.data;
        localStorage.setItem('authToken', accessToken);
        return accessToken;
    }
};

// Export de la instancia principal
export default api;

// Export de configuración para testing
export { API_CONFIG, useMockService };