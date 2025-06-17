import { useState } from 'react';
import { validateAsignaturaData, validateHorarioData } from '../utils/validators';

export const useValidation = () => {
    const [errors, setErrors] = useState({});
    const [isValidating, setIsValidating] = useState(false);

    const validateAsignatura = async (data) => {
        setIsValidating(true);

        try {
            const validation = validateAsignaturaData(data);
            setErrors(validation.errors);
            return validation;
        } catch (error) {
            console.error('Error validating asignatura:', error);
            return { isValid: false, errors: { general: 'Error de validación' } };
        } finally {
            setIsValidating(false);
        }
    };

    const validateHorario = async (data) => {
        setIsValidating(true);

        try {
            const validation = validateHorarioData(data);
            setErrors(validation.errors);
            return validation;
        } catch (error) {
            console.error('Error validating horario:', error);
            return { isValid: false, errors: { general: 'Error de validación' } };
        } finally {
            setIsValidating(false);
        }
    };

    const clearErrors = () => {
        setErrors({});
    };

    const getError = (field) => {
        return errors[field];
    };

    const hasErrors = () => {
        return Object.keys(errors).length > 0;
    };

    return {
        errors,
        isValidating,
        validateAsignatura,
        validateHorario,
        clearErrors,
        getError,
        hasErrors
    };
};