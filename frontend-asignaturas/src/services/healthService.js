import api from './api';

export const healthService = {
    // Verificar salud del API
    checkHealth: async () => {
        try {
            const response = await api.get('/health', {
                timeout: 5000,
                validateStatus: (status) => status === 200
            });
            return {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                responseTime: response.headers['x-response-time'] || 'unknown',
                data: response.data
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: error.message,
                details: error.response?.data || 'No response from server'
            };
        }
    },

    // Verificar conexión con base de datos
    checkDatabase: async () => {
        try {
            const response = await api.get('/health/db');
            return response.data;
        } catch (error) {
            throw new Error(`Database check failed: ${error.message}`);
        }
    },

    // Verificar endpoints principales
    checkEndpoints: async () => {
        const endpoints = [
            { name: 'Asignaturas', url: '/asignaturas', method: 'GET' },
            { name: 'Pensum', url: '/planes-estudio', method: 'GET' },
            { name: 'Horarios', url: '/horarios', method: 'GET' }
        ];

        const results = await Promise.allSettled(
            endpoints.map(async (endpoint) => {
                try {
                    const start = Date.now();
                    await api({
                        method: endpoint.method,
                        url: endpoint.url,
                        timeout: 3000
                    });
                    const responseTime = Date.now() - start;

                    return {
                        ...endpoint,
                        status: 'available',
                        responseTime: `${responseTime}ms`
                    };
                } catch (error) {
                    return {
                        ...endpoint,
                        status: 'unavailable',
                        error: error.message
                    };
                }
            })
        );

        return results.map(r => r.value || r.reason);
    },

    // Obtener información del servidor
    getServerInfo: async () => {
        try {
            const response = await api.get('/info');
            return response.data;
        } catch (error) {
            throw new Error(`Server info failed: ${error.message}`);
        }
    }
};

export default healthService;