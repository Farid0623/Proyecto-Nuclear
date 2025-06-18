import React from 'react';
import PropTypes from 'prop-types';
import { clsx } from 'clsx';

const Button = React.forwardRef(({
                                     children,
                                     className,
                                     variant = 'primary',
                                     size = 'md',
                                     disabled = false,
                                     loading = false,
                                     type = 'button',
                                     ...props
                                 }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm hover:shadow-md',
        secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 shadow-sm hover:shadow-md',
        success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 shadow-sm hover:shadow-md',
        warning: 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500 shadow-sm hover:shadow-md',
        danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500 shadow-sm hover:shadow-md',
        ghost: 'text-gray-700 hover:bg-primary-50 hover:text-primary-700 focus:ring-primary-500',
        outline: 'border border-primary-300 text-primary-700 bg-white hover:bg-primary-50 focus:ring-primary-500',
        'outline-secondary': 'border border-secondary-300 text-secondary-700 bg-white hover:bg-secondary-50 focus:ring-secondary-500'
    };

    const sizes = {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
        xl: 'px-8 py-4 text-lg'
    };

    return (
        <button
            ref={ref}
            type={type}
            disabled={disabled || loading}
            className={clsx(
                baseClasses,
                variants[variant],
                sizes[size],
                loading && 'cursor-wait',
                className
            )}
            {...props}
        >
            {loading && (
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {children}
        </button>
    );
});

// PropTypes
Button.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    variant: PropTypes.oneOf([
        'primary',
        'secondary',
        'success',
        'warning',
        'danger',
        'ghost',
        'outline',
        'outline-secondary'
    ]),
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

Button.defaultProps = {
    className: '',
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    type: 'button'
};

Button.displayName = 'Button';

export default Button;