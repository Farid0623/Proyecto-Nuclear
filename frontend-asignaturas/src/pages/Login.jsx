import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, actions } = useApp();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [redirecting, setRedirecting] = useState(false);

    const from = location.state?.from?.pathname || '/';

    // Verificar autenticación y redirigir
    useEffect(() => {
        console.log('🔍 Login useEffect - Auth status:', user.isAuthenticated);
        if (user.isAuthenticated && !redirecting) {
            console.log('👤 User authenticated, preparing redirect to:', from);
            setRedirecting(true);

            // Usar setTimeout para asegurar que el estado se actualice
            setTimeout(() => {
                console.log('🚀 Executing redirect to:', from);
                navigate(from, { replace: true });
            }, 100);
        }
    }, [user.isAuthenticated, navigate, from, redirecting]);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            email: 'admin@cue.edu.co',
            password: 'admin123'
        }
    });

    const doLogin = async (userData) => {
        console.log('🔐 Executing login with user:', userData);

        // Crear tokens mock
        const mockToken = 'token-' + Date.now();
        const mockRefreshToken = 'refresh-' + Date.now();

        // Guardar en localStorage PRIMERO
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('refreshToken', mockRefreshToken);
        localStorage.setItem('userData', JSON.stringify(userData));

        console.log('💾 Tokens saved:', { mockToken, mockRefreshToken });

        // Actualizar contexto
        actions.setUser(userData);

        // Toast de éxito
        toast.success(`¡Bienvenido ${userData.nombre}!`);

        console.log('✅ Login process completed, redirecting...');

        // Forzar redirección después del login
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        console.log('🚀 Login attempt with:', data.email);

        try {
            // Simular delay de login
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Datos del usuario mock
            const userData = {
                id: 1,
                nombre: 'Administrador Demo',
                email: data.email,
                rol: 'administrador'
            };

            // Ejecutar login
            await doLogin(userData);

        } catch (error) {
            console.error('❌ Login error:', error);
            toast.error('Error en el login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickLogin = async () => {
        console.log('⚡ Quick login triggered');
        setIsLoading(true);

        const userData = {
            id: 1,
            nombre: 'Usuario Rápido',
            email: 'admin@cue.edu.co',
            rol: 'administrador'
        };

        await doLogin(userData);
        setIsLoading(false);
    };

    // Si está redirigiendo, mostrar loading
    if (redirecting) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 flex items-center justify-center p-4">
                <Card className="p-8 text-center">
                    <LoadingSpinner size="lg" className="mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Acceso Exitoso
                    </h2>
                    <p className="text-gray-600">
                        Redirigiendo al sistema...
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Debug Info - Solo visible en desarrollo */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mb-4 p-3 bg-black text-white text-xs rounded">
                        <div>🔧 DEBUG:</div>
                        <div>Auth: {user.isAuthenticated ? 'YES' : 'NO'}</div>
                        <div>Token: {localStorage.getItem('authToken') ? 'YES' : 'NO'}</div>
                        <div>Path: {location.pathname}</div>
                        <div>Redirect: {from}</div>
                        <div>Redirecting: {redirecting ? 'YES' : 'NO'}</div>
                    </div>
                )}

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center shadow-lg">
                        <span className="text-blue-600 font-bold text-2xl">AH</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                        Sistema de Gestión
                    </h1>
                    <p className="text-white/90 drop-shadow">
                        Universidad Alexander von Humboldt
                    </p>
                </div>

                {/* Login Form */}
                <Card className="p-8 shadow-2xl">
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Iniciar Sesión
                        </h2>
                        <p className="text-gray-600">
                            Ingresa tus credenciales para acceder
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Input
                            label="Correo Electrónico"
                            type="email"
                            placeholder="usuario@cue.edu.co"
                            {...register('email', {
                                required: 'El correo es obligatorio'
                            })}
                            error={errors.email?.message}
                            disabled={isLoading}
                        />

                        <div className="relative">
                            <Input
                                label="Contraseña"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                {...register('password', {
                                    required: 'La contraseña es obligatoria'
                                })}
                                error={errors.password?.message}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transform transition hover:scale-105"
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <LoadingSpinner size="sm" color="white" className="mr-2" />
                                    Iniciando sesión...
                                </>
                            ) : (
                                <>
                                    <LogIn className="h-4 w-4 mr-2" />
                                    Iniciar Sesión
                                </>
                            )}
                        </Button>

                        {/* Botón de acceso rápido */}
                        <Button
                            type="button"
                            onClick={handleQuickLogin}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transform transition hover:scale-105"
                        >
                            ⚡ Acceso Rápido (Demo)
                        </Button>
                    </form>

                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                        <div className="text-sm text-blue-800">
                            <strong>Credenciales de Prueba:</strong><br />
                            📧 Email: admin@cue.edu.co<br />
                            🔑 Password: admin123
                        </div>
                    </div>
                </Card>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-white/80 text-sm drop-shadow">
                        © 2025 Universidad Alexander von Humboldt
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;