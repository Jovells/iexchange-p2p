import { Check, ChevronDown, DollarSign } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

interface Currency {
    symbol: string;
    name: string;
    icon?: React.ReactNode;
}

interface InputSelectProps {
    label?: string;
    initialCurrency?: string;
    initialAmount?: string;
    currencies: Currency[];
    onValueChange?: (value: { currency: string; amount: string }) => void;
    readOnly?: boolean;
    placeholder?: string;
    selectIsReadOnly?:boolean;
}

const InputWithSelect: React.FC<InputSelectProps> = ({
    label = 'You receive',
    initialCurrency = 'GHS',
    initialAmount = '0.00',
    currencies,
    onValueChange,
    readOnly = false,
    placeholder = 'Enter amount',
    selectIsReadOnly=false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState({ currency: initialCurrency, amount: initialAmount });
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (currency: string) => {
        setValue((prevState) => {
            const newValue = { ...prevState, currency };
            if (onValueChange) {
                onValueChange(newValue);
            }
            return newValue;
        });
        setIsOpen(false);
    };

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const amount = event.target.value;
        setValue((prevState) => {
            const newValue = { ...prevState, amount };
            if (onValueChange) {
                onValueChange(newValue);
            }
            return newValue;
        });
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
        <div ref={dropdownRef} className="w-full relative border rounded-xl cursor-pointer">
            <div className="w-full flex flex-col px-3 py-1">
                <span>{label}</span>
                <div className="flex items-center w-full">
                    <input
                        type="text"
                        className="flex-1 p-2 px-0 border-none outline-none"
                        value={value.amount}
                        readOnly={readOnly}
                        placeholder={placeholder}
                        onChange={handleAmountChange}
                    />
                    <div className="flex items-center space-x-1" onClick={toggleDropdown}>
                        {currencies.find((c) => c.symbol === value.currency)?.icon || <DollarSign className="w-4 h-4" />}
                        <span>{value.currency}</span>
                        <ChevronDown />
                    </div>
                </div>
            </div>
            {(isOpen && !selectIsReadOnly) && (
                <div className="absolute w-full bg-gray-50 p-2 border rounded-lg shadow-md z-10">
                    {currencies.map((currency) => (
                        <div
                            key={currency.symbol}
                            className="flex justify-between p-2 border-b last:border-b-0 hover:bg-gray-100"
                            onClick={() => handleSelect(currency.symbol)}
                        >
                            <div className="flex items-center space-x-2">
                                {currency.icon || <DollarSign className="w-4 h-4" />}
                                <span>{currency.symbol}</span>
                            </div>
                            {currency.symbol === value.currency && <Check />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InputWithSelect;
