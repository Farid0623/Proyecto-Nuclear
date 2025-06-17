import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, BookOpen, Clock, AlertTriangle } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Card from '../common/Card';

const SemestreDetailsModal = ({ semestre, numero, planId, onClose }) => {
    const { t } = useTranslation();

    const totalCreditos = semestre.asignaturas?.reduce((sum, asig) =>
        sum + (asig.creditos || 0), 0) || 0;

    const totalHoras = semestre.asignaturas?.reduce((sum, asig) =>
        sum + ((asig.horasTeoricas || 0) + (asig.horasPracticas || 0)), 0) || 0;

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={`Detalles del Semestre ${numero}`}
            size="lg"
        >
            <div className="space-y-6">
                {/* Resumen del semestre */}
                <Card>
                    <Card.Header>
                        <Card.Title>Resumen</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-primary-600">{semestre.asignaturas?.length || 0}</div>
                                <div className="text-sm text-gray-600">Asignaturas</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-success-600">{totalCreditos}</div>
                                <div className="text-sm text-gray-600">Créditos</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-warning-600">{totalHoras}h</div>
                                <div className="text-sm text-gray-600">Horas Totales</div>
                            </div>
                        </div>
                    </Card.Content>
                </Card>

                {/* Validaciones */}
                <Card>
                    <Card.Header>
                        <Card.Title>Estado de Validación</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                {totalCreditos >= 12 && totalCreditos <= 20 ? (
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                ) : (
                                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                )}
                                <span className={`text-sm ${totalCreditos >= 12 && totalCreditos <= 20 ? 'text-green-700' : 'text-yellow-700'}`}>
                  Créditos por semestre: {totalCreditos} (Rango: 12-20)
                </span>
                            </div>
                        </div>
                    </Card.Content>
                </Card>

                {/* Lista de asignaturas */}
                <Card>
                    <Card.Header>
                        <Card.Title>Asignaturas del Semestre</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        {semestre.asignaturas?.length > 0 ? (
                            <div className="space-y-3">
                                {semestre.asignaturas.map((asignatura, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <BookOpen className="h-4 w-4 text-primary-500" />
                                            <div>
                                                <div className="font-medium">{asignatura.nombre}</div>
                                                <div className="text-sm text-gray-600">{asignatura.codigo}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">{asignatura.creditos} créditos</div>
                                            <div className="text-sm text-gray-600 flex items-center">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {(asignatura.horasTeoricas || 0) + (asignatura.horasPracticas || 0)}h
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No hay asignaturas en este semestre
                            </div>
                        )}
                    </Card.Content>
                </Card>

                {/* Observaciones */}
                {semestre.observaciones && (
                    <Card>
                        <Card.Header>
                            <Card.Title>Observaciones</Card.Title>
                        </Card.Header>
                        <Card.Content>
                            <p className="text-gray-700">{semestre.observaciones}</p>
                        </Card.Content>
                    </Card>
                )}
            </div>

            <div className="flex justify-end mt-6">
                <Button onClick={onClose}>
                    <X className="h-4 w-4 mr-2" />
                    Cerrar
                </Button>
            </div>
        </Modal>
    );
};

export default SemestreDetailsModal;