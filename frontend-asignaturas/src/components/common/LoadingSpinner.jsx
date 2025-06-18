import React from 'react';
import PropTypes from 'prop-types';
import { clsx } from 'clsx';

const LoadingSpinner = ({
                            size = 'md',
                            className,
                            color = 'primary',
                            text
                        }) => {
    const sizeClasses = {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12'
    };

    const colorClasses = {
        primary: 'border-primary-600',
        white: 'border-white',
        gray: 'border-gray-600'
    };

    return (
        <div className={clsx('flex flex-col items-center space-y-2', className)}>
            <div
                className={clsx(
                    'animate-spin rounded-full border-2 border-gray-200',
                    sizeClasses[size],
                    `border-t-2 ${colorClasses[color]}`
                )}
            />
            {text && (
                <p className="text-sm text-gray-600">{text}</p>
            )}
        </div>
    );
};

// PropTypes
LoadingSpinner.propTypes = {
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    className: PropTypes.string,
    color: PropTypes.oneOf(['primary', 'white', 'gray']),
    text: PropTypes.string
};

LoadingSpinner.defaultProps = {
    size: 'md',
    className: '',
    color: 'primary',
    text: ''
};

export default LoadingSpinner;