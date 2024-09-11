'use client'

import React from 'react';

interface Props {
    className?: string;
}

const Loader: React.FC<Props> = ({ className }) => {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
    );
};

export default Loader;
