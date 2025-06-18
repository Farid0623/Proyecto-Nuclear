import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import Button from './Button';

const Modal = ({
                   isOpen,
                   onClose,
                   title,
                   children,
                   size = 'md',
                   showCloseButton = true,
                   closeOnBackdrop = true,
                   closeOnEscape = true,
                   footer,
                   className
               }) => {
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full mx-4'
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e) => {
            if (closeOnEscape && e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, closeOnEscape, onClose]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) {
            onClose();
        }
    };

    const modalContent = (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={handleBackdropClick}
                aria-hidden="true"
            />

            {/* Modal container */}
            <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
                <dialog
                    open={isOpen}
                    className={clsx(
                        'relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full',
                        sizeClasses[size],
                        'animate-scale-in',
                        className
                    )}
                    aria-labelledby={title ? 'modal-title' : undefined}
                >
                    {/* Header */}
                    {(title || showCloseButton) && (
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            {title && (
                                <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
                                    {title}
                                </h3>
                            )}
                            {showCloseButton && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600"
                                    aria-label="Cerrar modal"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Content */}
                    <div className="px-6 py-4">
                        {children}
                    </div>

                    {/* Footer */}
                    {footer && (
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            {footer}
                        </div>
                    )}
                </dialog>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
    showCloseButton: PropTypes.bool,
    closeOnBackdrop: PropTypes.bool,
    closeOnEscape: PropTypes.bool,
    footer: PropTypes.node,
    className: PropTypes.string
};

Modal.defaultProps = {
    title: null,
    size: 'md',
    showCloseButton: true,
    closeOnBackdrop: true,
    closeOnEscape: true,
    footer: null,
    className: ''
};

export default Modal;