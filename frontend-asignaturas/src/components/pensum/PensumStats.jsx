import React from 'react';
import PropTypes from 'prop-types';
import { BookOpen, Calendar, TrendingUp, BarChart } from 'lucide-react';
import Card from '../common/Card';

const PensumStats = ({ estadisticas, className }) => {
    if (!estadisticas) return null;

    return (
        <div className={className}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-3">
                        <BookOpen className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        {estadisticas.totalAsignaturas || 0}
                    </div>
                    <div className="text-sm text-gray-600">
                        Total Asignaturas
                    </div>
                </Card>

                <Card className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-success-100 rounded-lg mx-auto mb-3">
                        <Calendar className="h-6 w-6 text-success-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        {estadisticas.totalSemestres || 0}
                    </div>
                    <div className="text-sm text-gray-600">
                        Semestres
                    </div>
                </Card>

                <Card className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-warning-100 rounded-lg mx-auto mb-3">
                        <TrendingUp className="h-6 w-6 text-warning-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        {estadisticas.totalCreditos || 0}
                    </div>
                    <div className="text-sm text-gray-600">
                        Total Créditos
                    </div>
                </Card>

                <Card className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
                        <BarChart className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        {estadisticas.progresoCompletitud ? `${estadisticas.progresoCompletitud}%` : '0%'}
                    </div>
                    <div className="text-sm text-gray-600">
                        Completitud
                    </div>
                </Card>
            </div>
        </div>
    );
};

PensumStats.propTypes = {
    estadisticas: PropTypes.shape({
        totalAsignaturas: PropTypes.number,
        totalSemestres: PropTypes.number,
        totalCreditos: PropTypes.number,
        progresoCompletitud: PropTypes.number
    }),
    className: PropTypes.string
};

PensumStats.defaultProps = {
    estadisticas: null,
    className: ''
};

export default PensumStats;