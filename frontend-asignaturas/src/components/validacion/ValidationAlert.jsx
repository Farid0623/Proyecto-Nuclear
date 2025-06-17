import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';

const ValidationAlert = ({
                             type = 'info',
                             title,
                             message,
                             onClose,
                             dismissible = false,
                             className
                         }) => {
    const config = {
        success: {
            icon: CheckCircle,
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            iconColor: 'text-green-400',
            titleColor: 'text-green-800',
            textColor: 'text-green-700'
        },
        error: {
            icon: AlertCircle,
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            iconColor: 'text-red-400',
            titleColor: 'text-red-800',
            textColor: 'text-red-700'
        },
        warning: {
            icon: AlertTriangle,
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            iconColor: 'text-yellow-400',
            titleColor: 'text-yellow-800',
            textColor: 'text-yellow-700'
        },
        info: {
            icon: Info,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            iconColor: 'text-blue-400',
            titleColor: 'text-blue-800',
            textColor: 'text-blue-700'
        }
    };

    const currentConfig = config[type];
    const Icon = currentConfig.icon;

    return (
        <div className={clsx(
            'rounded-md border p-4',
            currentConfig.bgColor,
            currentConfig.borderColor,
            className
        )}>
            <div className="flex">
                <div className="flex-shrink-0">
                    <Icon className={clsx('h-5 w-5', currentConfig.iconColor)} />
                </div>

                <div className="ml-3 flex-1">
                    {title && (
                        <h3 className={clsx('text-sm font-medium', currentConfig.titleColor)}>
                            {title}
                        </h3>
                    )}

                    {message && (
                        <div className={clsx('text-sm', title ? 'mt-1' : '', currentConfig.textColor)}>
                            {typeof message === 'string' ? (
                                <p>{message}</p>
                            ) : (
                                message
                            )}
                        </div>
                    )}
                </div>

                {dismissible && onClose && (
                    <div className="ml-auto pl-3">
                        <div className="-mx-1.5 -my-1.5">
                            <button
                                type="button"
                                onClick={onClose}
                                className={clsx(
                                    'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                                    currentConfig.bgColor,
                                    currentConfig.iconColor,
                                    'hover:opacity-75'
                                )}
                            >
                                <span className="sr-only">Cerrar</span>
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ValidationAlert;