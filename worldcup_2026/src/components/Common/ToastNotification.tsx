import { useEffect } from 'react';
import './ToastNotification.css';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastNotificationProps {
    type: ToastType;
    message: string;
    onClose: () => void;
}

function ToastNotification({ type, message, onClose }: ToastNotificationProps) {

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = {
        success: 'bg-success',
        error: 'bg-danger',
        warning: 'bg-warning text-dark',
        info: 'bg-info text-white',
    }[type];

    const icon = {
        success: '✓',
        error: '✕',
        warning: '!',
        info: 'ℹ',
    }[type];

    return (
        <div className="toast-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" 
            onClick={onClose}>
            <div className={`card ${bgColor} text-white shadow-lg border-0 toast-card`}
                onClick={(e) => e.stopPropagation()} >
                <div className="card-body p-4 d-flex align-items-center gap-3">
                    <div className="toast-icon flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle">{icon}</div>
                    <div className="flex-grow-1">
                        <h5 className="mb-0 fw-bold text-capitalize">
                            {type === 'error' ? 'Erreur'
                            : type === 'success' ? 'Succès'
                            : type === 'warning' ? 'Attention'
                            : 'Info'}
                        </h5>
                        <p className="mb-0 mt-1 toast-message" >{message}</p>
                    </div>
                    <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Fermer" />
                </div>
            </div>
        </div>
    );
}

export default ToastNotification;
