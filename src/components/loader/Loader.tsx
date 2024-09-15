'use client'

import React from 'react';

interface Props {
    className?: string;
    loaderType?: "spinner" | "text"
}

const Loader: React.FC<Props> = ({ className, loaderType = "spinner" }) => {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            {loaderType === "spinner" && <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>}
            {loaderType === "text" && (
                <div className="flex items-center text-lg font-light">
                    <span>Loading</span>
                    <span className="dot-1 ml-1">.</span>
                    <span className="dot-2">.</span>
                    <span className="dot-3">.</span>
                </div>
            )}
        </div>
    );
};

export default Loader;
