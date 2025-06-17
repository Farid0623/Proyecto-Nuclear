import React from 'react';
import { clsx } from 'clsx';

const Input = React.forwardRef(({
                                    label,
                                    error,
                                    helpText,
                                    className,
                                    type = 'text',
                                    disabled = false,
                                    required = false,
                                    ...props
                                }, ref) => {
    const inputClasses = clsx(
        'block w-full rounded-md border-gray-300 shadow-sm transition-colors duration-200',
        'focus:border-primary-500 focus:ring-primary-500',
        'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
        error && 'border-danger-300 text-danger-900 placeholder-danger-300 focus:border-danger-500 focus:ring-danger-500',
        className
    );

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-danger-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <input
                    ref={ref}
                    type={type}
                    disabled={disabled}
                    className={inputClasses}
                    {...props}
                />
            </div>

            {error && (
                <p className="mt-1 text-sm text-danger-600">
                    {error}
                </p>
            )}

            {helpText && !error && (
                <p className="mt-1 text-sm text-gray-500">
                    {helpText}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;