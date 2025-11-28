import React from 'react';
import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    isLoading = false,
    disabled = false,
    fullWidth = false,
    onClick,
    type = 'button',
    className = '',
    ...props
}) => {
    const classNames = [
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth && 'btn-full',
        isLoading && 'btn-loading',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classNames}
            onClick={onClick}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <span className="btn-spinner"></span>
            )}
            {!isLoading && Icon && iconPosition === 'left' && (
                <Icon className="btn-icon btn-icon-left" />
            )}
            <span className="btn-text">{children}</span>
            {!isLoading && Icon && iconPosition === 'right' && (
                <Icon className="btn-icon btn-icon-right" />
            )}
        </button>
    );
};

export { Button };
export default Button;
