import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, Globe, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { authAPI } from '../../services/api';
import Button from './Button';
import ConnectionStatus from './ConnectionStatus';
import toast from 'react-hot-toast';

const Header = ({ onToggleSidebar }) => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const { user, actions } = useApp();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'es' ? 'en' : 'es';
        i18n.changeLanguage(newLang);
    };

    const handleToggleSidebar = () => {
        if (onToggleSidebar && typeof onToggleSidebar === 'function') {
            onToggleSidebar();
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            // Llamar al endpoint de logout del backend
            await authAPI.logout();

            // Limpiar estado de la aplicación
            actions.logout();

            // Mostrar mensaje de confirmación
            toast.success('Sesión cerrada exitosamente');

            // Redirigir al login
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            // Aún así, limpiar localmente y redirigir
            actions.logout();
            navigate('/login', { replace: true });
            toast.error('Error al cerrar sesión, pero se ha cerrado localmente');
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <header className="university-header sticky top-0 z-40 bg-gradient-to-r from-purple-600 to-blue-600">
            <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                {/* Left side - Menu button and Logo */}
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleToggleSidebar}
                        className="lg:hidden text-white hover:bg-white/10 focus:ring-white/20"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    <div className="university-logo flex items-center space-x-3">
                        <div className="university-logo-icon w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            <span className="text-purple-600 font-bold text-lg">AH</span>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-lg font-bold text-white leading-tight">
                                Universidad Alexander von Humboldt
                            </h1>
                            <p className="text-xs text-white/90 leading-tight">
                                Sistema de Gestión Académica
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center space-x-2 lg:space-x-4">
                    {/* Connection Status */}
                    <ConnectionStatus />

                    {/* Language Toggle */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleLanguage}
                        className="hidden sm:flex text-white hover:bg-white/10 focus:ring-white/20"
                        title="Cambiar idioma"
                    >
                        <Globe className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium text-white">
                            {i18n.language.toUpperCase()}
                        </span>
                    </Button>

                    {/* Settings */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/10 focus:ring-white/20"
                        title="Configuración"
                        onClick={() => navigate('/configuracion')}
                    >
                        <Settings className="h-4 w-4" />
                    </Button>

                    {/* Notifications */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="relative text-white hover:bg-white/10 focus:ring-white/20"
                        title="Notificaciones"
                    >
                        <Bell className="h-4 w-4" />
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white border border-white">
                            3
                        </span>
                    </Button>

                    {/* User Menu */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-2 text-white hover:bg-white/10 focus:ring-white/20"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                        >
                            <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-white" />
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-medium text-white leading-tight">
                                    {user.nombre || 'Usuario'}
                                </p>
                                <p className="text-xs text-white/90 leading-tight">
                                    {user.email || 'usuario@cue.edu.co'}
                                </p>
                            </div>
                            <ChevronDown className="h-4 w-4 text-white" />
                        </Button>

                        {/* User Dropdown Menu */}
                        {showUserMenu && (
                            <>
                                {/* Overlay para cerrar el menú */}
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowUserMenu(false)}
                                />

                                <div className="absolute right-0 top-12 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                                    <div className="py-1">
                                        {/* User Info */}
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">
                                                {user.nombre || 'Usuario'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {user.email || 'usuario@cue.edu.co'}
                                            </p>
                                            <p className="text-xs text-gray-400 capitalize">
                                                {user.rol || 'administrador'}
                                            </p>
                                        </div>

                                        {/* Menu Items */}
                                        <button
                                            onClick={() => {
                                                setShowUserMenu(false);
                                                navigate('/configuracion');
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <Settings className="h-4 w-4 mr-3" />
                                            Configuración
                                        </button>

                                        <button
                                            onClick={() => {
                                                setShowUserMenu(false);
                                                // Aquí puedes abrir un modal de perfil
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <User className="h-4 w-4 mr-3" />
                                            Mi Perfil
                                        </button>

                                        <div className="border-t border-gray-100 my-1" />

                                        {/* Logout */}
                                        <button
                                            onClick={() => {
                                                setShowUserMenu(false);
                                                handleLogout();
                                            }}
                                            disabled={isLoggingOut}
                                            className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                                        >
                                            <LogOut className="h-4 w-4 mr-3" />
                                            {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

Header.propTypes = {
    onToggleSidebar: PropTypes.func.isRequired
};

export default Header;