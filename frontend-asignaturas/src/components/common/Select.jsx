import React from 'react';
import { clsx } from 'clsx';

const Select = React.forwardRef(({
                                     label,
                                     error,
                                     helpText,
                                     className,
                                     children,
                                     disabled = false,
                                     required = false,
                                     ...props
                                 }, ref) => {
    const selectClasses = clsx(
        'block w-full rounded-md border-gray-300 shadow-sm transition-colors duration-200',
        'focus:border-primary-500 focus:ring-primary-500',
        'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
        error && 'border-danger-300 focus:border-danger-500 focus:ring-danger-500',
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

            <select
                ref={ref}
                disabled={disabled}
                className={selectClasses}
                {...props}
            >
                {children}
            </select>

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

Select.displayName = 'Select';

export default Select;