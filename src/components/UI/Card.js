import React from 'react';
import './Card.css';

const Card = ({
    children,
    variant = 'default',
    glass = false,
    hoverable = false,
    padding = 'md',
    className = '',
    onClick,
    ...props
}) => {
    const classNames = [
        'card',
        `card-${variant}`,
        `card-padding-${padding}`,
        glass && 'card-glass',
        hoverable && 'card-hoverable',
        onClick && 'card-clickable',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={classNames} onClick={onClick} {...props}>
            {children}
        </div>
    );
};

export { Card };
export default Card;
