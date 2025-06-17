import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../components/common/Card';

const Horarios = () => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {t('schedules.title')}
                </h1>
                <p className="text-gray-600">
                    {t('schedules.subtitle')}
                </p>
            </div>

            <Card>
                <Card.Content>
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">
                            Módulo de Horarios en desarrollo
                        </p>
                        <p className="text-sm text-gray-400">
                            Esta funcionalidad estará disponible próximamente
                        </p>
                    </div>
                </Card.Content>
            </Card>
        </div>
    );
};

export default Horarios;