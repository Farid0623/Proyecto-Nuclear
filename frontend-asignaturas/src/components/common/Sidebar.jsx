import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    Calendar,
    Clock,
    Settings,
    X,
    Users,
    FileText
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
            name: 'Estudiantes',
            href: '/estudiantes',
            icon: Users,
            current: location.pathname.startsWith('/estudiantes')
        },
        {
            name: 'Reportes',
            href: '/reportes',
            icon: FileText,
            current: location.pathname.startsWith('/reportes')
        },
        {
            name: t('navigation.settings'),
            href: '/configuracion',
            icon: Settings,
            current: location.pathname.startsWith('/configuracion')
        }
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={clsx(
                'fixed inset-y-0 left-0 z-50 w-64 university-sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
                isOpen ? 'translate-x-0' : '-translate-x-full'
            )}>
                <div className="flex flex-col h-full">
                    {/* Mobile close button */}
                    <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 lg:hidden">
                        <div className="university-logo">
                            <div className="university-logo-icon text-lg">
                                <span>AH</span>
                            </div>
                            <span className="text-lg font-semibold text-gray-900 ml-2">Menú</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
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
                                    key={item.name}
                                    to={item.href}
                                    onClick={onClose}
                                    className={clsx(
                                        'flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                                        item.current
                                            ? 'nav-item-active text-university-purple bg-university-light-gradient'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-university-purple'
                                    )}
                                >
                                    <Icon className={clsx(
                                        'mr-3 h-5 w-5',
                                        item.current
                                            ? 'text-university-purple'
                                            : 'text-gray-400 group-hover:text-university-purple'
                                    )} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom section - University Info */}
                    <div className="px-4 py-4 border-t border-gray-200">
                        <div className="university-card p-3">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="university-logo-icon">
                                        <span>AH</span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-university-purple">
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

export default Sidebar;