import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { healthService } from '../../services/healthService';
import Button from './Button';

const ConnectionStatus = () => {
    const [status, setStatus] = useState('checking');
    const [details, setDetails] = useState(null);
    const [isChecking, setIsChecking] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        checkConnection();

        // Verificar conexión cada 30 segundos
        const interval = setInterval(checkConnection, 30000);

        return () => clearInterval(interval);
    }, []);

    const checkConnection = async () => {
        setIsChecking(true);
        try {
            const health = await healthService.checkHealth();
            setStatus(health.status);
            setDetails(health);

            if (health.status === 'unhealthy') {
                console.error('API Connection failed:', health.error);
            }
        } catch (error) {
            setStatus('error');
            setDetails({ error: error.message });
        } finally {
            setIsChecking(false);
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'healthy':
                return <Wifi className="h-4 w-4 text-green-600" />;
            case 'unhealthy':
                return <WifiOff className="h-4 w-4 text-red-600" />;
            case 'checking':
                return <RefreshCw className="h-4 w-4 text-gray-600 animate-spin" />;
            default:
                return <AlertCircle className="h-4 w-4 text-yellow-600" />;
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'healthy':
                return 'Conectado';
            case 'unhealthy':
                return 'Sin conexión';
            case 'checking':
                return 'Verificando...';
            default:
                return 'Error';
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'healthy':
                return 'text-green-600 bg-green-50';
            case 'unhealthy':
                return 'text-red-600 bg-red-50';
            case 'checking':
                return 'text-gray-600 bg-gray-50';
            default:
                return 'text-yellow-600 bg-yellow-50';
        }
    };

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className={`flex items-center space-x-2 ${getStatusColor()} rounded-full px-3 py-1`}
                disabled={isChecking}
            >
                {getStatusIcon()}
                <span className="text-xs font-medium">{getStatusText()}</span>
            </Button>

            {showDetails && (
                <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64 z-50">
                    <h4 className="font-semibold text-sm mb-2">Estado de Conexión</h4>

                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-gray-600">API Backend:</span>
                            <span className={status === 'healthy' ? 'text-green-600' : 'text-red-600'}>
                                {status === 'healthy' ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>

                        {details?.responseTime && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tiempo de respuesta:</span>
                                <span>{details.responseTime}</span>
                            </div>
                        )}

                        {details?.error && (
                            <div className="mt-2 p-2 bg-red-50 rounded text-red-600">
                                {details.error}
                            </div>
                        )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={checkConnection}
                            disabled={isChecking}
                            className="w-full justify-center"
                        >
                            <RefreshCw className={`h-3 w-3 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
                            Verificar Conexión
                        </Button>
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                        URL: {process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConnectionStatus;