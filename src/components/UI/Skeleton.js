import React from 'react';
import './Skeleton.css';

const Skeleton = ({
    width,
    height,
    circle = false,
    count = 1,
    className = ''
}) => {
    const skeletons = Array.from({ length: count }, (_, i) => i);

    const style = {
        width,
        height: circle ? width : height
    };

    return (
        <>
            {skeletons.map((index) => (
                <div
                    key={index}
                    className={`skeleton ${circle ? 'skeleton-circle' : ''} ${className}`}
                    style={style}
                />
            ))}
        </>
    );
};

export default Skeleton;
