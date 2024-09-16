'use client'

import { Check, CheckCircle, CheckSquare, ChevronDown } from 'lucide-react';
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
}

const InputSelect: React.FC<InputSelectProps> = ({
    label,
    initialValue = '',
    options,
    onValueChange,
    placeholder="Select",
    ...props
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(initialValue);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (value: string  ) => {
        setSelectedValue(prevValue => {
        const newValue = (value === prevValue)? '': value;
        if (onValueChange) {
            onValueChange(newValue);
        }
        return newValue;
    }
        );
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
        <div ref={dropdownRef} className="relative border rounded-xl cursor-pointer w-full ">
            <div className="w-full flex flex-col px-3 py-3">
                {(label && selectedValue) && <span className='text-sm text-gray-500 '>{label}</span>}
                <div className="flex items-center w-full" onClick={toggleDropdown}>
                    <div className="flex items-center flex-1 space-x-1">
                        {!selectedValue && <span className='text-sm text-gray-500 '>{label}</span>}
                        {<span>{selectedOption?.label || <span className=' text-gray-400 '>{placeholder}</span>}</span>}
                    </div>
                    <ChevronDown />
                </div>
            </div>
            {isOpen && (
                <div className="absolute w-full bg-gray-50 p-2 border rounded-lg shadow-md z-10">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className="flex justify-between p-2 border-b last:border-b-0 hover:bg-gray-100"
                            //@ts-ignore
                            onClick={() => handleSelect(option.value)}
                        >
                            <div className="flex items-center space-x-4">
                                {/* {option.icon} */}
                                {option.value === selectedValue ? <Check className='bg-black text-white w-4 h-4 rounded-lg' /> : <Check className='w-4 h-4 opacity-0' />}
                                <span className='border-l-4 border-blue-500 pl-2'>{option.label}</span>
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
