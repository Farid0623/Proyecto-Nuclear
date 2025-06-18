import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
    BookOpen,
    Calendar,
    Clock,
    Users,
    TrendingUp,
    Activity,
    ArrowRight
} from 'lucide-react';
import { useAsignaturas } from '../hooks/useAsignaturas';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
    const { t } = useTranslation();
    const { data: asignaturas, isLoading } = useAsignaturas();

    // Calcular estadísticas
    const stats = {
        totalAsignaturas: asignaturas?.length || 0,
        asignaturasActivas: asignaturas?.filter(a => a.activa).length || 0,
        totalCreditos: asignaturas?.reduce((sum, a) => sum + (a.creditos || 0), 0) || 0,
        promedioCreditos: asignaturas?.length > 0
            ? (asignaturas.reduce((sum, a) => sum + (a.creditos || 0), 0) / asignaturas.length).toFixed(1)
            : 0
    };

    const quickActions = [
        {
            id: 'create-subject',
            title: t('subjects.createSubject'),
            description: 'Crear nueva asignatura en el sistema',
            icon: BookOpen,
            href: '/asignaturas/crear',
            color: 'primary'
        },
        {
            id: 'manage-curriculum',
            title: 'Gestionar Pensum',
            description: 'Organizar asignaturas por semestres',
            icon: Calendar,
            href: '/pensum',
            color: 'success'
        },
        {
            id: 'configure-schedules',
            title: 'Configurar Horarios',
            description: 'Asignar horarios a las materias',
            icon: Clock,
            href: '/horarios',
            color: 'warning'
        }
    ];

    const recentActivities = [
        {
            id: 'activity-1',
            type: 'create',
            icon: BookOpen,
            bgColor: 'bg-success-100',
            iconColor: 'text-success-600',
            title: 'Nueva asignatura',
            description: 'Matemáticas III',
            action: 'creada',
            time: 'Hace 2 horas'
        },
        {
            id: 'activity-2',
            type: 'update',
            icon: Calendar,
            bgColor: 'bg-primary-100',
            iconColor: 'text-primary-600',
            title: 'Pensum actualizado para',
            description: 'Ingeniería de Software',
            action: '',
            time: 'Hace 4 horas'
        },
        {
            id: 'activity-3',
            type: 'assign',
            icon: Clock,
            bgColor: 'bg-warning-100',
            iconColor: 'text-warning-600',
            title: 'Horarios asignados para',
            description: '5 asignaturas',
            action: '',
            time: 'Ayer'
        },
        {
            id: 'activity-4',
            type: 'enrollment',
            icon: Users,
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
            title: '12 estudiantes',
            description: 'matriculados en nuevas asignaturas',
            action: '',
            time: 'Hace 2 días'
        }
    ];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {t('dashboard.title')}
                </h1>
                <p className="text-gray-600">
                    {t('dashboard.welcome')}
                </p>
            </div>

            {/* Estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-3">
                        <BookOpen className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        {stats.totalAsignaturas}
                    </div>
                    <div className="text-sm text-gray-600">
                        {t('dashboard.stats.subjects')}
                    </div>
                    <div className="mt-2 text-xs text-success-600">
                        {stats.asignaturasActivas} activas
                    </div>
                </Card>

                <Card className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-success-100 rounded-lg mx-auto mb-3">
                        <Calendar className="h-6 w-6 text-success-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        10
                    </div>
                    <div className="text-sm text-gray-600">
                        {t('dashboard.stats.semesters')}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                        Plan de estudios
                    </div>
                </Card>

                <Card className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-warning-100 rounded-lg mx-auto mb-3">
                        <Clock className="h-6 w-6 text-warning-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        {stats.totalCreditos}
                    </div>
                    <div className="text-sm text-gray-600">
                        Créditos Totales
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                        Promedio: {stats.promedioCreditos}
                    </div>
                </Card>

                <Card className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
                        <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        156
                    </div>
                    <div className="text-sm text-gray-600">
                        {t('dashboard.stats.students')}
                    </div>
                    <div className="mt-2 text-xs text-purple-600">
                        +12 este mes
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Acciones rápidas */}
                <Card>
                    <Card.Header>
                        <Card.Title className="flex items-center">
                            <Activity className="h-5 w-5 mr-2 text-primary-600" />
                            {t('dashboard.quickActions')}
                        </Card.Title>
                    </Card.Header>

                    <Card.Content>
                        <div className="space-y-3">
                            {quickActions.map((action) => {
                                const Icon = action.icon;
                                const colorClass = `text-${action.color}-600`;
                                const bgColorClass = `bg-${action.color}-100`;

                                return (
                                    <Link
                                        key={action.id}
                                        to={action.href}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 ${bgColorClass} rounded-lg`}>
                                                <Icon className={`h-4 w-4 ${colorClass}`} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{action.title}</p>
                                                <p className="text-sm text-gray-600">{action.description}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-gray-400" />
                                    </Link>
                                );
                            })}
                        </div>
                    </Card.Content>
                </Card>

                {/* Actividad reciente */}
                <Card>
                    <Card.Header>
                        <Card.Title className="flex items-center">
                            <TrendingUp className="h-5 w-5 mr-2 text-success-600" />
                            {t('dashboard.recentActivity')}
                        </Card.Title>
                    </Card.Header>

                    <Card.Content>
                        <div className="space-y-4">
                            {recentActivities.map((activity) => {
                                const Icon = activity.icon;

                                return (
                                    <div key={activity.id} className="flex items-start space-x-3">
                                        <div className={`p-1 ${activity.bgColor} rounded-full`}>
                                            <Icon className={`h-3 w-3 ${activity.iconColor}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900">
                                                {activity.title} <span className="font-medium">{activity.description}</span> {activity.action}
                                            </p>
                                            <p className="text-xs text-gray-500">{activity.time}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card.Content>
                </Card>
            </div>

            {/* Resumen del sistema */}
            <Card>
                <Card.Header>
                    <Card.Title>{t('dashboard.overview')}</Card.Title>
                </Card.Header>

                <Card.Content>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary-600 mb-2">
                                {((stats.asignaturasActivas / stats.totalAsignaturas) * 100 || 0).toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-600">
                                Asignaturas Activas
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="text-3xl font-bold text-success-600 mb-2">
                                85%
                            </div>
                            <div className="text-sm text-gray-600">
                                Pensum Completado
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="text-3xl font-bold text-warning-600 mb-2">
                                92%
                            </div>
                            <div className="text-sm text-gray-600">
                                Horarios Asignados
                            </div>
                        </div>
                    </div>
                </Card.Content>
            </Card>
        </div>
    );
};

export default Dashboard;