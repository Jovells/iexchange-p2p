import React, { ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps {
    text?: string | ReactNode;
    icon?: React.ReactNode | string;
    iconPosition?: 'left' | 'right' | any;
    iconClassName?: string;
    onClick?: () => void;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    text,
    icon,
    iconPosition = 'left',
    iconClassName,
    onClick,
    className,
}) => {
    const baseClasses = 'flex justify-center items-center rounded font-medium';
    const defaultClasses = '';

    return (
        <button
            onClick={onClick}
            className={clsx(baseClasses, defaultClasses, className)}
        >
            {iconPosition === 'any' && icon && (
                <span className="">
                    {typeof icon === 'string' ? (
                        <img src={icon} alt="icon" className={`${iconClassName}`} />
                    ) : (
                        icon
                    )}
                </span>
            )}
            {iconPosition === 'left' && icon && (
                <span className="mr-2">
                    {typeof icon === 'string' ? (
                        <img src={icon} alt="icon" className={`h-5 w-5 ${iconClassName}`} />
                    ) : (
                        icon
                    )}
                </span>
            )}
            {text}
            {iconPosition === 'right' && icon && (
                <span className="ml-2">
                    {typeof icon === 'string' ? (
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
