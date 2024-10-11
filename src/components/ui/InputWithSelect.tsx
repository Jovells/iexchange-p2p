'use client';

import { Check, ChevronDown } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

interface Currency {
  symbol: string;
  name: string;
  id: `0x${string}`;
  icon?: React.ReactNode;
}

interface InputSelectProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  initialCurrencyName?: string;
  initialAmount?: any;
  currencies: Currency[];
  onValueChange?: (value: { currency: string; amount: string; id: `0x${string}` | null }) => void;
  readOnly?: boolean;
  placeholder?: string;
  selectIsReadOnly?: boolean;
}

const InputWithSelect: React.FC<InputSelectProps> = ({
  label,
  initialCurrencyName = "GHS",
  initialAmount,
  currencies,
  onValueChange,
  value,
  readOnly = false,
  placeholder = "Enter amount",
  selectIsReadOnly = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<{ currency: string; amount: string; id: `0x${string}` | null }>({
    currency: initialCurrencyName,
    amount: initialAmount,
    id: currencies.find(c => c.symbol === initialCurrencyName)?.id || null,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (currency: Currency) => {
    const newValue = { ...selectedValue, currency: currency.symbol, id: currency.id };
    setSelectedValue(prevState => {
      const newCurrencySymbol = currency.symbol;
      const newCurrencyId = currency.id;
      return { ...prevState, currency: newCurrencySymbol, id: newCurrencyId! };
    });
    if (onValueChange) {
      onValueChange(newValue);
    }
    setIsOpen(false);
  };

  const valueToDisplay = value ? { amount: value, currency: selectedValue.currency } : selectedValue;

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = event.target.value;
    setSelectedValue(prevState => {
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
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={dropdownRef}
      className="w-full hover:dark:border-[#01a2e4] relative border transition-all duration-300 ease-in-out hover:border-[#01a2e4] border-gray-300 dark:border-gray-600 rounded-[8px] cursor-pointer"
    >
      <div className="w-full flex flex-col px-3 py-1">
        {selectedValue.amount && label && (
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</span>
        )}
        <div className="flex items-center w-full">
          <input
            type="text"
            className="flex-1 p-2 px-0 border-none outline-none bg-transparent text-black dark:text-white"
            value={valueToDisplay.amount}
            readOnly={readOnly}
            placeholder={!selectedValue.amount ? placeholder : ""}
            onChange={handleAmountChange}
          />
          <div className="flex items-center space-x-1" onClick={toggleDropdown}>
            {currencies.find(c => c.symbol === valueToDisplay.currency)?.icon}
            <span className="text-black dark:text-white">
              {valueToDisplay.currency || <span className="text-gray-500 dark:text-white mb-1">All</span>}
            </span>
            {currencies.length > 1 && <ChevronDown className="text-gray-500 dark:text-gray-400" />}
          </div>
        </div>
      </div>
      {isOpen && !selectIsReadOnly && (
        <div className="absolute w-full bg-white dark:bg-gray-700 p-2 border border-gray-200 dark:border-gray-600 rounded-[8px] shadow-md z-10">
          {currencies.map(currency => (
            <div
              key={currency.id}
              className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
              onClick={() => handleSelect(currency)}
            >
              <div className="flex items-center space-x-2 text-black dark:text-white">
                {currency.icon}
                <span className="text-black dark:text-white">{currency.symbol}</span>
              </div>
              {currency.symbol === valueToDisplay.currency && <Check className="text-blue-500 dark:text-blue-400" />}
            </div>
          ))}
        </div>
      )}
      <input type="hidden" {...props} value={value} />
    </div>
  );
};

export default InputWithSelect;
