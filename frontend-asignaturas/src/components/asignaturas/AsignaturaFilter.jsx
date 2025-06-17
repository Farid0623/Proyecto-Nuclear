import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Select from '../common/Select';

const AsignaturaFilter = ({ filters, onFiltersChange }) => {
    const { t } = useTranslation();

    // Validar props con valores por defecto
    const currentFilters = {
        status: filters?.status || 'all',
        semester: filters?.semester || '',
        credits: filters?.credits || ''
    };

    const handleFilterChange = (key, value) => {
        if (onFiltersChange && typeof onFiltersChange === 'function') {
            onFiltersChange(prev => ({
                ...prev,
                [key]: value
            }));
        }
    };

    const handleStatusChange = (e) => {
        handleFilterChange('status', e.target.value);
    };

    const handleSemesterChange = (e) => {
        handleFilterChange('semester', e.target.value);
    };

    const handleCreditsChange = (e) => {
        handleFilterChange('credits', e.target.value);
    };

    return (
        <div className="flex flex-wrap gap-4">
            <div className="w-full sm:w-auto min-w-[150px]">
                <Select
                    value={currentFilters.status}
                    onChange={handleStatusChange}
                    aria-label="Filtrar por estado"
                >
                    <option value="all">{t('subjects.filters.all')}</option>
                    <option value="active">{t('subjects.filters.active')}</option>
                    <option value="inactive">{t('subjects.filters.inactive')}</option>
                </Select>
            </div>

            <div className="w-full sm:w-auto min-w-[120px]">
                <Select
                    value={currentFilters.semester}
                    onChange={handleSemesterChange}
                    aria-label="Filtrar por semestre"
                >
                    <option value="">{t('subjects.filters.bySemester')}</option>
                    {[1,2,3,4,5,6,7,8,9,10].map(sem => (
                        <option key={sem} value={sem}>
                            {t('common.labels.semester')} {sem}
                        </option>
                    ))}
                </Select>
            </div>

            <div className="w-full sm:w-auto min-w-[120px]">
                <Select
                    value={currentFilters.credits}
                    onChange={handleCreditsChange}
                    aria-label="Filtrar por créditos"
                >
                    <option value="">{t('subjects.filters.byCredits')}</option>
                    {[1,2,3,4,5,6,7,8,9,10].map(cred => (
                        <option key={cred} value={cred}>
                            {cred} {t('common.labels.credits')}
                        </option>
                    ))}
                </Select>
            </div>
        </div>
    );
};

// Definición de PropTypes
AsignaturaFilter.propTypes = {
    filters: PropTypes.shape({
        status: PropTypes.string,
        semester: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        credits: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }).isRequired,
    onFiltersChange: PropTypes.func.isRequired
};

export default AsignaturaFilter;