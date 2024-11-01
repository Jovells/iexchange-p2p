'use client'

import React from 'react';

interface Props {
  className?: string;
  loaderType?: "spinner" | "text";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fullPage?: boolean;
}

const Loader: React.FC<Props> = ({ className, loaderType = "spinner", size = "md", fullPage }) => {
  const sizeToPix = size === "xs" ? 4 : size === "sm" ? 10 : size === "md" ? 16 : size === "lg" ? 24 : 32;
  return (
    <div className={`flex items-center justify-center ${className + (fullPage ? " h-screen, w-screen" : "")}`}>
      {loaderType === "spinner" && (
        <div
          className={`w-${sizeToPix} h-${sizeToPix} border-4 border-blue-500 border-dashed rounded-full animate-spin`}
        ></div>
      )}
      {loaderType === "text" && (
        <div className={`flex items-center text-${size} font-light text-black dark:text-white`}>
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
