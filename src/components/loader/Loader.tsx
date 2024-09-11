'use client';

import React, { FC } from 'react';

type LoaderProps = {
    size?: 'small' | 'medium' | 'large'; // Different sizes for the loader
    color?: string; // Customize the color of the loader
    className?: string; // Optional prop to allow for additional custom styling
};

const Loader: FC<LoaderProps> = ({ size = 'medium', color = '#000', className = '' }) => {
    // Set size classes based on the provided size prop
    const sizeClasses = {
        small: 'h-4 w-4',
        medium: 'h-8 w-8',
        large: 'h-12 w-12',
    };

    return (
        <div
            className={`inline-block border-4 border-t-transparent rounded-full animate-spin ${sizeClasses[size]} ${className}`}
            style={{ borderColor: color }} // Use the provided color for the loader
        />
    );
};

export default Loader;
