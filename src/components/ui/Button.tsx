'use client';

import React, { ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string | ReactNode;
  icon?: React.ReactNode | string;
  iconPosition?: "left" | "right" | "any";
  iconClassName?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  loading?: boolean;
  loadingText?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  children,
  icon,
  iconPosition = "left",
  iconClassName,
  onClick,
  className,
  loading = false,
  loadingText = "Loading...",
  ...ButtonProps
}) => {
  const baseClasses = "flex justify-center items-center rounded font-medium";
  const defaultClasses = "";

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button
      {...ButtonProps}
      onClick={handleClick}
      disabled={loading}
      className={clsx(baseClasses, defaultClasses, className, {
        "cursor-not-allowed opacity-70": loading,
      })}
    >
      {loading && (
        <span className="mr-2 loader" aria-hidden="true">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        </span>
      )}
      {!loading && iconPosition === "left" && icon && (
        <span className="mr-2">
          {typeof icon === "string" ? (
            <img src={icon} alt="icon" className={`h-5 w-5 ${iconClassName}`} />
          ) : (
            icon
          )}
        </span>
      )}
      {loading ? loadingText : text || children}
      {!loading && iconPosition === "right" && icon && (
        <span className="ml-2">
          {typeof icon === "string" ? (
            <img src={icon} alt="icon" className={`h-5 w-5 ${iconClassName}`} />
          ) : (
            icon
          )}
        </span>
      )}
    </button>
  );
};

export default Button;
