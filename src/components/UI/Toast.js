import React, { createContext, useContext, useState, useCallback } from 'react';
import { FiCheckCircle } from '@react-icons/all-files/fi/FiCheckCircle';
import { FiAlertCircle } from '@react-icons/all-files/fi/FiAlertCircle';
import { FiInfo } from '@react-icons/all-files/fi/FiInfo';
import { FiX } from '@react-icons/all-files/fi/FiX';
import './Toast.css';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now().toString();
        const toast = { id, message, type, duration };

        setToasts(prev => [...prev, toast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, [removeToast]);

    const success = useCallback((message, duration) => {
        return addToast(message, 'success', duration);
    }, [addToast]);

    const error = useCallback((message, duration) => {
        return addToast(message, 'error', duration);
    }, [addToast]);

    const info = useCallback((message, duration) => {
        return addToast(message, 'info', duration);
    }, [addToast]);

    const warning = useCallback((message, duration) => {
        return addToast(message, 'warning', duration);
    }, [addToast]);

    return (
        <ToastContext.Provider value={{ addToast, removeToast, success, error, info, warning }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer = ({ toasts, onRemove }) => {
    if (toasts.length === 0) return null;

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
};

const Toast = ({ toast, onRemove }) => {
    const { id, message, type } = toast;

    const icons = {
        success: FiCheckCircle,
        error: FiAlertCircle,
        warning: FiAlertCircle,
        info: FiInfo
    };

    const Icon = icons[type];

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-content">
                <Icon className="toast-icon" />
                <span className="toast-message">{message}</span>
            </div>
            <button
                className="toast-close"
                onClick={() => onRemove(id)}
                aria-label="Close notification"
            >
                <FiX />
            </button>
        </div>
    );
};

export default ToastProvider;
