import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
                <p>&copy; 2025 Universidad Alexander von Humboldt. Todos los derechos reservados.</p>
                <p>Armenia, Quindío - Sistema de Gestión v1.0.0</p>
            </div>
        </footer>
    );
};

export default Footer;