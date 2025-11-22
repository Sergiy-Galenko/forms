import React from 'react';
import './Card.css';

export const Card = ({
    children,
    className = '',
    hoverable = false,
    onClick,
    ...props
}) => {
    return (
        <div
            className={`card ${hoverable ? 'card-hover' : ''} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = '' }) => (
    <div className={`card-header ${className}`}>{children}</div>
);

export const CardBody = ({ children, className = '' }) => (
    <div className={`card-body ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
    <div className={`card-footer ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }) => (
    <h3 className={`card-title ${className}`}>{children}</h3>
);

export const CardSubtitle = ({ children, className = '' }) => (
    <p className={`card-subtitle ${className}`}>{children}</p>
);
