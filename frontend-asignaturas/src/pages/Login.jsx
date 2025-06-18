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
    const { user, login } = useApp();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const from = location.state?.from?.pathname || '/';

    // Si ya está autenticado, redirigir
    useEffect(() => {
        if (user.isAuthenticated) {
            console.log('✅ Already authenticated, redirecting to:', from);
            navigate(from, { replace: true });
        }
    }, [user.isAuthenticated, navigate, from]);

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

    const onSubmit = async (data) => {
        setIsLoading(true);
        console.log('🚀 Login attempt with:', data.email);

        try {
            // Validar credenciales
            const validUsers = [
                { email: 'admin@cue.edu.co', password: 'admin123', nombre: 'Administrador', rol: 'admin' },
                { email: 'coordinador@cue.edu.co', password: 'coord123', nombre: 'Coordinador', rol: 'coordinador' }
            ];

            const validUser = validUsers.find(u => u.email === data.email && u.password === data.password);

            if (!validUser) {
                toast.error('Credenciales incorrectas');
                return;
            }

            // Preparar datos del usuario
            const userData = {
                id: 1,
                nombre: validUser.nombre,
                email: validUser.email,
                rol: validUser.rol
            };

            // Intentar login
            const success = login(userData);

            if (success) {
                toast.success(`¡Bienvenido ${userData.nombre}!`);

                // Esperar un poco y redirigir
                setTimeout(() => {
                    navigate(from, { replace: true });
                }, 500);
            } else {
                toast.error('Error en el login');
            }

        } catch (error) {
            console.error('❌ Login error:', error);
            toast.error('Error en el login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickLogin = () => {
        const userData = {
            id: 1,
            nombre: 'Usuario Demo',
            email: 'admin@cue.edu.co',
            rol: 'admin'
        };

        const success = login(userData);
        if (success) {
            toast.success(`¡Bienvenido ${userData.nombre}!`);
            navigate(from, { replace: true });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Debug en desarrollo */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mb-4 p-3 bg-black text-white text-xs rounded font-mono">
                        <div>🔧 DEBUG:</div>
                        <div>Auth: {user.isAuthenticated ? '✅' : '❌'}</div>
                        <div>User: {user.nombre || 'None'}</div>
                        <div>Token: {localStorage.getItem('authToken') ? '✅' : '❌'}</div>
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
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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

                        <Button
                            type="button"
                            onClick={handleQuickLogin}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        >
                            ⚡ Acceso Rápido
                        </Button>
                    </form>

                    {/* Credenciales */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-sm text-blue-800">
                            <strong>Credenciales:</strong><br />
                            📧 admin@cue.edu.co / admin123<br />
                            📧 coordinador@cue.edu.co / coord123
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