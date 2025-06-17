import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, User, Globe, Palette, Bell, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import ValidationAlert from '../components/validacion/ValidationAlert';

const Configuracion = () => {
    const { t, i18n } = useTranslation();
    const { user, preferences, actions } = useApp();
    const [saved, setSaved] = useState(false);

    const [formData, setFormData] = useState({
        nombre: user.nombre || '',
        email: user.email || '',
        idioma: i18n.language,
        itemsPerPage: preferences.itemsPerPage,
        autoSave: preferences.autoSave,
        notifications: preferences.notifications,
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        // Actualizar preferencias
        actions.updatePreferences({
            itemsPerPage: formData.itemsPerPage,
            autoSave: formData.autoSave,
            notifications: formData.notifications,
        });

        // Cambiar idioma si es necesario
        if (formData.idioma !== i18n.language) {
            i18n.changeLanguage(formData.idioma);
        }

        // Actualizar usuario
        actions.setUser({
            nombre: formData.nombre,
            email: formData.email,
        });

        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {t('navigation.settings')}
                </h1>
                <p className="text-gray-600">
                    Personaliza tu experiencia en el sistema
                </p>
            </div>

            {saved && (
                <ValidationAlert
                    type="success"
                    title="Configuración guardada"
                    message="Los cambios se han guardado exitosamente"
                    dismissible
                    onClose={() => setSaved(false)}
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Configuración de perfil */}
                <div className="lg:col-span-2">
                    <Card>
                        <Card.Header>
                            <Card.Title className="flex items-center">
                                <User className="h-5 w-5 mr-2 text-university-purple" />
                                Información del Perfil
                            </Card.Title>
                        </Card.Header>

                        <Card.Content>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Nombre completo"
                                    value={formData.nombre}
                                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                                />

                                <Input
                                    label="Correo electrónico"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                />
                            </div>
                        </Card.Content>
                    </Card>

                    {/* Configuración de aplicación */}
                    <Card className="mt-6">
                        <Card.Header>
                            <Card.Title className="flex items-center">
                                <Palette className="h-5 w-5 mr-2 text-university-purple" />
                                Configuración de la Aplicación
                            </Card.Title>
                        </Card.Header>

                        <Card.Content>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Select
                                    label="Idioma"
                                    value={formData.idioma}
                                    onChange={(e) => handleInputChange('idioma', e.target.value)}
                                >
                                    <option value="es">Español</option>
                                    <option value="en">English</option>
                                </Select>

                                <Select
                                    label="Elementos por página"
                                    value={formData.itemsPerPage}
                                    onChange={(e) => handleInputChange('itemsPerPage', Number(e.target.value))}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </Select>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Guardado automático</h4>
                                        <p className="text-sm text-gray-600">
                                            Guardar cambios automáticamente mientras trabajas
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.autoSave}
                                        onChange={(e) => handleInputChange('autoSave', e.target.checked)}
                                        className="h-4 w-4 text-university-purple focus:ring-university-purple border-gray-300 rounded"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Notificaciones</h4>
                                        <p className="text-sm text-gray-600">
                                            Recibir notificaciones del sistema
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.notifications}
                                        onChange={(e) => handleInputChange('notifications', e.target.checked)}
                                        className="h-4 w-4 text-university-purple focus:ring-university-purple border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                        </Card.Content>

                        <Card.Footer>
                            <div className="flex justify-end">
                                <Button
                                    onClick={handleSave}
                                    className="btn-university-primary"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Guardar Configuración
                                </Button>
                            </div>
                        </Card.Footer>
                    </Card>
                </div>

                {/* Panel lateral */}
                <div className="space-y-6">
                    {/* Información del sistema */}
                    <Card>
                        <Card.Header>
                            <Card.Title className="flex items-center">
                                <Shield className="h-5 w-5 mr-2 text-university-purple" />
                                Sistema
                            </Card.Title>
                        </Card.Header>

                        <Card.Content>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Versión:</span>
                                    <span className="font-medium">1.0.0</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Rol:</span>
                                    <span className="font-medium capitalize">{user.rol}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Estado:</span>
                                    <span className="text-green-600 font-medium">En línea</span>
                                </div>
                            </div>
                        </Card.Content>
                    </Card>

                    {/* Acciones rápidas */}
                    <Card>
                        <Card.Header>
                            <Card.Title>Acciones Rápidas</Card.Title>
                        </Card.Header>

                        <Card.Content>
                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                >
                                    <Globe className="h-4 w-4 mr-2" />
                                    Cambiar Idioma
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                >
                                    <Bell className="h-4 w-4 mr-2" />
                                    Configurar Notificaciones
                                </Button>
                            </div>
                        </Card.Content>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Configuracion;