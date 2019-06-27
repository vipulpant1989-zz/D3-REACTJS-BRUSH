import React from 'react';
import './index.css';

export default ({
    x,
    y,
    message,
    width,
    height,
}) => {
    return (
        <g>
            <rect className='modal' x={x + 10} y={y} width={width} height={height} />
            <text  x={x+15} y={y + 20}>Name: {message}</text>
        </g>
    );
};