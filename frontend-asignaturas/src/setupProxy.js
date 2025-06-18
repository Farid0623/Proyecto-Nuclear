const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    // Proxy para todas las rutas de API
    app.use(
        '/api',
        createProxyMiddleware({
            target: process.env.REACT_APP_API_URL || 'http://localhost:8080',
            changeOrigin: true,
            secure: false,
            logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'silent',
            timeout: 30000,

            // Headers personalizados
            onProxyReq: (proxyReq, req, res) => {
                // Agregar headers CORS
                proxyReq.setHeader('Access-Control-Allow-Origin', '*');
                proxyReq.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
                proxyReq.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

                // Log en desarrollo
                if (process.env.NODE_ENV === 'development') {
                    console.log(`🔄 Proxying request: ${req.method} ${req.url} -> ${proxyReq.getHeader('host')}${proxyReq.path}`);
                }
            },

            onProxyRes: (proxyRes, req, res) => {
                // Agregar headers CORS a la respuesta
                proxyRes.headers['Access-Control-Allow-Origin'] = '*';
                proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
                proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';

                // Log en desarrollo
                if (process.env.NODE_ENV === 'development') {
                    console.log(`✅ Proxy response: ${proxyRes.statusCode} ${req.url}`);
                }
            },

            onError: (err, req, res) => {
                console.error('❌ Proxy error:', {
                    message: err.message,
                    url: req.url,
                    method: req.method,
                    stack: err.stack
                });

                // Respuesta de error personalizada
                res.status(500).json({
                    error: 'Proxy Error',
                    message: 'No se pudo conectar con el servidor backend',
                    details: err.message,
                    timestamp: new Date().toISOString()
                });
            },

            // Configuración adicional para WebSockets si es necesario
            ws: true,

            // Reescritura de paths si es necesario
            pathRewrite: {
                '^/api': '' // Remover /api del path cuando se envía al backend
            }
        })
    );

    // Middleware para manejar OPTIONS requests (preflight CORS)
    app.use((req, res, next) => {
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            res.sendStatus(200);
        } else {
            next();
        }
    });
};