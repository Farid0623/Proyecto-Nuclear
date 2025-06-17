import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Menu, Bell, User, Globe, Settings } from 'lucide-react';
import Button from './Button';

const Header = ({ onToggleSidebar }) => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'es' ? 'en' : 'es';
        i18n.changeLanguage(newLang);
    };

    const handleToggleSidebar = () => {
        if (onToggleSidebar && typeof onToggleSidebar === 'function') {
            onToggleSidebar();
        }
    };

    return (
        <header className="university-header sticky top-0 z-40">
            <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                {/* Left side - Menu button and Logo */}
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleToggleSidebar}
                        className="lg:hidden text-white hover:bg-white/10"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    <div className="university-logo">
                        <div className="university-logo-icon">
                            <span className="text-university-purple font-bold">AH</span>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-lg font-bold text-white">
                                Universidad Alexander von Humboldt
                            </h1>
                            <p className="text-xs text-white/80">
                                Sistema de Gestión Académica
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center space-x-2 lg:space-x-4">
                    {/* Language Toggle */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleLanguage}
                        className="hidden sm:flex text-white hover:bg-white/10"
                        title="Cambiar idioma"
                    >
                        <Globe className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">
                            {i18n.language.toUpperCase()}
                        </span>
                    </Button>

                    {/* Settings */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/10"
                        title="Configuración"
                    >
                        <Settings className="h-4 w-4" />
                    </Button>

                    {/* Notifications */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="relative text-white hover:bg-white/10"
                        title="Notificaciones"
                    >
                        <Bell className="h-4 w-4" />
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                            3
                        </span>
                    </Button>

                    {/* User Menu */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-2 text-white hover:bg-white/10"
                        >
                            <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-white" />
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-medium text-white">
                                    Administrador
                                </p>
                                <p className="text-xs text-white/80">
                                    admin@cue.edu.co
                                </p>
                            </div>
                        </Button>
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