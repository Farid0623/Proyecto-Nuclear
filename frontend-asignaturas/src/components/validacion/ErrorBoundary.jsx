import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // Log error to monitoring service
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-red-100 rounded-full">
                                <AlertTriangle className="h-8 w-8 text-red-600" />
                            </div>
                        </div>

                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            ¡Oops! Algo salió mal
                        </h2>

                        <p className="text-gray-600 mb-6">
                            Se ha producido un error inesperado. Por favor, intenta recargar la página.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mb-4 p-3 bg-gray-100 rounded text-left text-sm">
                                <strong>Error:</strong> {this.state.error.toString()}
                                <br />
                                <strong>Stack:</strong>
                                <pre className="whitespace-pre-wrap text-xs mt-1">
                  {this.state.errorInfo.componentStack}
                </pre>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                            <Button
                                onClick={this.handleReset}
                                variant="primary"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Intentar de nuevo
                            </Button>

                            <Button
                                onClick={() => window.location.reload()}
                                variant="outline"
                            >
                                Recargar página
                            </Button>
                        </div>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;