import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    Calendar,
    Clock,
    Settings,
    X
} from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const location = useLocation();

    const navigationItems = [
        {
            name: t('navigation.dashboard'),
            href: '/',
            icon: LayoutDashboard,
            current: location.pathname === '/'
        },
        {
            name: t('navigation.subjects'),
            href: '/asignaturas',
            icon: BookOpen,
            current: location.pathname.startsWith('/asignaturas')
        },
        {
            name: t('navigation.curriculum'),
            href: '/pensum',
            icon: Calendar,
            current: location.pathname.startsWith('/pensum')
        },
        {
            name: t('navigation.schedules'),
            href: '/horarios',
            icon: Clock,
            current: location.pathname.startsWith('/horarios')
        },
        {
            name: t('navigation.settings'),
            href: '/configuracion',
            icon: Settings,
            current: location.pathname.startsWith('/configuracion')
        }
    ];

    const handleClose = () => {
        if (onClose && typeof onClose === 'function') {
            onClose();
        }
    };

    const handleLinkClick = () => {
        // Cerrar sidebar en móvil después de hacer clic en un enlace
        handleClose();
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={handleClose}
                    aria-label="Cerrar menú de navegación"
                >
                    <span className="sr-only">Cerrar menú de navegación</span>
                </button>
            )}

            {/* Sidebar */}
            <div className={clsx(
                'fixed inset-y-0 left-0 z-50 w-64 institutional-sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
                isOpen ? 'translate-x-0' : '-translate-x-full'
            )}>
                <div className="flex flex-col h-full">
                    {/* Mobile close button */}
                    <div className="flex items-center justify-between h-16 px-4 border-b border-primary-200 lg:hidden">
                        <div className="institutional-logo">
                            <div className="institutional-logo-icon">
                                <span>AH</span>
                            </div>
                            <span className="text-lg font-semibold text-primary-900 ml-2">Menú</span>
                        </div>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                            aria-label="Cerrar menú"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 custom-scrollbar overflow-y-auto">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={`nav-${item.name}`}
                                    to={item.href}
                                    onClick={handleLinkClick}
                                    className={clsx(
                                        'flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                                        item.current
                                            ? 'nav-item-active text-primary-700 bg-primary-50'
                                            : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
                                    )}
                                >
                                    <Icon className={clsx(
                                        'mr-3 h-5 w-5',
                                        item.current
                                            ? 'text-primary-600'
                                            : 'text-gray-400 group-hover:text-primary-600'
                                    )} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom section - University Info */}
                    <div className="px-4 py-4 border-t border-primary-200">
                        <div className="institutional-card p-3">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="institutional-logo-icon w-8 h-8 text-sm">
                                        <span>AH</span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-primary-700">
                                        Sistema de Gestión
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Versión 1.0.0 - 2025
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// PropTypes
Sidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default Sidebar;