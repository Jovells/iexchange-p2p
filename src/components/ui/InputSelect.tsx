'use client';

import { getPaymentMethodColor } from '@/lib/utils';
import { Check, ChevronDown, Square } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

interface SelectOption {
    value: string | number;
    label: string;
    icon?: React.ReactNode;
}

interface InputSelectProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    initialValue?: string;
    options: SelectOption[];
    onValueChange?: (value: string) => void;
    placeholder?: string;
    selectType?: string;
}

const InputSelect: React.FC<InputSelectProps> = ({
    label,
    initialValue = '',
    options,
    onValueChange,
    placeholder = "Select",
    selectType = "payment method",
    ...props
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(initialValue);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (value: string) => {
        setSelectedValue(prevValue => {
            const newValue = (value === prevValue) ? '' : value;
            if (onValueChange) {
                onValueChange(newValue);
            }
            return newValue;
        });
        setIsOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const selectedOption = options.find((option) => option.value === selectedValue);

    return (
      <div
        ref={dropdownRef}
        className="relative border   border-gray-300 dark:border-gray-600 rounded-[8px] cursor-pointer w-full transition-all duration-100 ease-in-out hover:border-[#01a2e4]"
      >
        <div className="w-full flex flex-col">
          {label && selectedValue && <span className="text-sm text-gray-500">{label}</span>}
          <div
            className="flex items-center w-full px-3 py-3  transition-all duration-300 ease-in-out"
            onClick={toggleDropdown}
          >
            <div className="flex items-center flex-1 space-x-2">
              {!selectedValue && <span className="text-sm text-gray-500">{label}</span>}
              <span className="text-black dark:text-white">
                {selectedOption?.label || <span className="text-gray-400">{placeholder}</span>}
              </span>
            </div>
            <ChevronDown className="text-gray-500" />
          </div>
        </div>
        {isOpen && (
          <div className="absolute w-full bg-white dark:bg-gray-700 p-2 border border-gray-200 dark:border-gray-600 rounded-[8px] shadow-md z-10 transition-all duration-300 ease-in-out">
            {options.map(option => (
              <div
                key={option.value}
                className="flex justify-between p-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-all duration-300 ease-in-out"
                //@ts-ignore
                onClick={() => handleSelect(option.value)}
              >
                <div className="flex items-center space-x-2">
                  {option.value === selectedValue ? (
                    <Check className="bg-blue-500 text-white w-4 h-4 rounded-lg" />
                  ) : (
                    <Square className="text-gray-300 w-4 h-4" />
                  )}

                  {selectType === "payment method" && (
                    <span
                      className={`text-black dark:text-white border-l-4 ${getPaymentMethodColor(
                        option.label.toLowerCase(),
                      )} pl-1`}
                    >
                      {option.label}
                    </span>
                  )}
                  {selectType !== "payment method" && (
                    <span className="text-black dark:text-white border-l-2 border-red-600 pl-1">{option.label}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <input type="hidden" {...props} value={selectedValue} />
      </div>
    );
};

export default InputSelect;
