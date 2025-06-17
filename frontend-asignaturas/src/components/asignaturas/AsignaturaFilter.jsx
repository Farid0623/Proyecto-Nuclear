import React from 'react';
import { useTranslation } from 'react-i18next';
import Select from '../common/Select';

const AsignaturaFilter = ({ filters, onFiltersChange }) => {
    const { t } = useTranslation();

    const handleFilterChange = (key, value) => {
        onFiltersChange(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div className="flex flex-wrap gap-4">
            <div className="w-full sm:w-auto min-w-[150px]">
                <Select
                    value={filters.status || 'all'}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                    <option value="all">{t('subjects.filters.all')}</option>
                    <option value="active">{t('subjects.filters.active')}</option>
                    <option value="inactive">{t('subjects.filters.inactive')}</option>
                </Select>
            </div>

            <div className="w-full sm:w-auto min-w-[120px]">
                <Select
                    value={filters.semester || ''}
                    onChange={(e) => handleFilterChange('semester', e.target.value)}
                >
                    <option value="">{t('subjects.filters.bySemester')}</option>
                    {[1,2,3,4,5,6,7,8,9,10].map(sem => (
                        <option key={sem} value={sem}>{t('common.labels.semester')} {sem}</option>
                    ))}
                </Select>
            </div>

            <div className="w-full sm:w-auto min-w-[120px]">
                <Select
                    value={filters.credits || ''}
                    onChange={(e) => handleFilterChange('credits', e.target.value)}
                >
                    <option value="">{t('subjects.filters.byCredits')}</option>
                    {[1,2,3,4,5,6,7,8,9,10].map(cred => (
                        <option key={cred} value={cred}>{cred} {t('common.labels.credits')}</option>
                    ))}
                </Select>
            </div>
        </div>
    );
};

export default AsignaturaFilter;