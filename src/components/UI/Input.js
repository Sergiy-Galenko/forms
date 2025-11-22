import React from 'react';
import './Input.css';

export const Input = ({
    label,
    error,
    helperText,
    className = '',
    id,
    ...props
}) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`input-wrapper ${className}`}>
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`input-field ${error ? 'input-error' : ''}`}
                {...props}
            />
            {error && <span className="input-error-message">{error}</span>}
            {helperText && !error && <span className="input-helper">{helperText}</span>}
        </div>
    );
};

export const TextArea = ({
    label,
    error,
    helperText,
    className = '',
    id,
    rows = 3,
    ...props
}) => {
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`input-wrapper ${className}`}>
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                </label>
            )}
            <textarea
                id={inputId}
                rows={rows}
                className={`input-field ${error ? 'input-error' : ''}`}
                {...props}
            />
            {error && <span className="input-error-message">{error}</span>}
            {helperText && !error && <span className="input-helper">{helperText}</span>}
        </div>
    );
};
