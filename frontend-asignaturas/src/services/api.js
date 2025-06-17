import axios from 'axios';
import toast from 'react-hot-toast';

// Configuración base de la API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Crear instancia de axios
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para requests
api.interceptors.request.use(
    (config) => {
        // Agregar token de autorización si existe
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log de la request en desarrollo
        if (process.env.NODE_ENV === 'development') {
            console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para responses
api.interceptors.response.use(
    (response) => {
        // Log de la response en desarrollo
        if (process.env.NODE_ENV === 'development') {
            console.log(`API Response: ${response.status} ${response.config.url}`);
        }

        return response;
    },
    (error) => {
        // Manejo centralizado de errores
        const message = getErrorMessage(error);

        // No mostrar toast para errores de autenticación (se manejan en el componente)
        if (error.response?.status !== 401) {
            toast.error(message);
        }

        // Log del error
        console.error('API Error:', error);

        return Promise.reject(error);
    }
);

// Función para extraer mensaje de error
const getErrorMessage = (error) => {
    if (error.response) {
        // Error de respuesta del servidor
        const { status, data } = error.response;

        switch (status) {
            case 400:
                return data.message || 'Datos inválidos';
            case 401:
                return 'No autorizado';
            case 403:
                return 'Acceso prohibido';
            case 404:
                return 'Recurso no encontrado';
            case 409:
                return data.message || 'Conflicto de datos';
            case 422:
                return data.message || 'Error de validación';
            case 500:
                return 'Error interno del servidor';
            default:
                return data.message || `Error ${status}`;
        }
    } else if (error.request) {
        // Error de red
        return 'Error de conexión con el servidor';
    } else {
        // Error de configuración
        return error.message || 'Error desconocido';
    }
};

// Funciones helper para las operaciones CRUD
export const apiRequest = {
    get: (url, config = {}) => api.get(url, config),
    post: (url, data = {}, config = {}) => api.post(url, data, config),
    put: (url, data = {}, config = {}) => api.put(url, data, config),
    patch: (url, data = {}, config = {}) => api.patch(url, data, config),
    delete: (url, config = {}) => api.delete(url, config),
};

// Funciones específicas para el manejo de respuestas
export const handleApiResponse = (response) => {
    return response.data;
};

export const handleApiError = (error) => {
    throw error;
};

// Función para construir parámetros de query
export const buildQueryParams = (params) => {
    const searchParams = new URLSearchParams();

    Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== null && value !== undefined && value !== '') {
            searchParams.append(key, value.toString());
        }
    });

    return searchParams.toString();
};

// Función para validar conexión con el backend
export const checkApiHealth = async () => {
    try {
        const response = await api.get('/health');
        return response.status === 200;
    } catch (error) {
        return false;
    }
};

export default api;