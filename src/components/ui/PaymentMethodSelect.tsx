'use client'

import { PaymentMethod } from '@/common/api/types';
import { Check, CheckCircle, CheckSquare, ChevronDown } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';



interface PaymentMethodSelectProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  selectedMethod?: PaymentMethod;
  initialValue?: string;
  options: PaymentMethod[] | [];
  onValueChange?: (value: PaymentMethod) => void;
  placeholder?: string;
  addButton?: React.ReactNode;
}

const PaymentMethodSelect: React.FC<PaymentMethodSelectProps> = ({
    label,
    initialValue ,
    options,
    onValueChange,
    placeholder="Select",
    addButton,
    ...props
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState({
        method: '',
    } as PaymentMethod);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (value: PaymentMethod  ) => {
        setSelectedValue(prevValue => {
        const newValue = value;
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


    return (
        <div ref={dropdownRef} className="relative border rounded-xl cursor-pointer w-full ">
            <div className="w-full flex flex-col px-3 py-3">
                {(label && selectedValue) && <span className='text-sm text-gray-500 '>{label}</span>}
                <div className="flex items-center w-full" onClick={toggleDropdown}>
                    <div className="flex items-center flex-1 space-x-1">
                        {!selectedValue && <span className='text-sm text-gray-500 '>{label}</span>}
                        {<>{selectedValue?.method?
                        <div className="flex w-full justify-between">
                        <div className="flex items-center space-x-4">
                            {/* {option.icon} */}
                            <span className='border-l-4 border-blue-500 pl-2'>{selectedValue.method}</span>
                        </div>
                        <div className="pr-2 flex items-center text-sm text-gray-500">
                               <div>
                                {selectedValue.number}
                                </div> 
                            </div>
                        </div>
                        : <span className=' text-gray-400 '>{placeholder}</span>}</>}
                    </div>
                    <ChevronDown />
                </div>
            </div>
            {isOpen && (
                <div className="absolute w-full bg-gray-50 p-2 border rounded-lg shadow-md z-10">
                    {options.map((option, i) => (
                        <div
                            key={i}
                            className="flex justify-between p-2 border-b last:border-b-0 hover:bg-gray-100"
                            //@ts-ignore
                            onClick={() => handleSelect(option)}
                        >
                            <div className="flex w-full justify-between">
                            <div className="flex items-center space-x-4">
                                {/* {option.icon} */}
                                {option === selectedValue ? <Check className='bg-black text-white w-4 h-4 rounded-lg' /> : <Check className='w-4 h-4 opacity-0' />}
                                <span className='border-l-4 border-blue-500 pl-2'>{option.method}</span>
                            </div>
                            <div className="min-w-40 text-sm text-gray-500">
                               <div>
                                {option.name}
                                </div> 
                               <div>
                                {option.number}
                                </div> 
                               <div>
                                {option.details}
                                </div> 
                            </div>
                            </div>
                        </div>
                    ))}
                    {addButton && addButton}
                </div>
            )}
            <input type="hidden" {...props} value={selectedValue.method} />

        </div>
    );
};

export default PaymentMethodSelect;
