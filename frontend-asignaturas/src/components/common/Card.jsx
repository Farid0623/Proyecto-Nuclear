import React from 'react';
import { clsx } from 'clsx';

const Card = ({
                  children,
                  className,
                  padding = 'md',
                  shadow = 'sm',
                  hover = false,
                  ...props
              }) => {
    const paddingClasses = {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8'
    };

    const shadowClasses = {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl'
    };

    return (
        <div
            className={clsx(
                'bg-white rounded-lg border border-gray-200',
                paddingClasses[padding],
                shadowClasses[shadow],
                hover && 'hover:shadow-md transition-shadow duration-200',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

const CardHeader = ({ children, className, ...props }) => (
    <div
        className={clsx('mb-4 pb-3 border-b border-gray-200', className)}
        {...props}
    >
        {children}
    </div>
);

const CardTitle = ({ children, className, ...props }) => (
    <h3
        className={clsx('text-lg font-semibold text-gray-900', className)}
        {...props}
    >
        {children}
    </h3>
);

const CardContent = ({ children, className, ...props }) => (
    <div className={clsx('space-y-4', className)} {...props}>
        {children}
    </div>
);

const CardFooter = ({ children, className, ...props }) => (
    <div
        className={clsx('mt-6 pt-4 border-t border-gray-200', className)}
        {...props}
    >
        {children}
    </div>
);

// Exportar componentes individuales
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;