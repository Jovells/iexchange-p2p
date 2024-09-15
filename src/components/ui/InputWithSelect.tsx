'use client'

import { Check, ChevronDown, DollarSign } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

interface Currency {
  symbol: string;
  name: string;
  id: `0x${string}`;
  icon?: React.ReactNode;
}

interface InputSelectProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  initialCurrency?: string;
  initialAmount?: any;
  currencies: Currency[];
  onValueChange?: (value: { currency: string; amount: string, id: `0x${string}` }) => void;
  readOnly?: boolean;
  placeholder?: string;
  selectIsReadOnly?: boolean;
}

const InputWithSelect: React.FC<InputSelectProps> = ({
  label,
  initialCurrency = "CEDIH",
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
  const [insideValue, setValue] = useState({
    currency: initialCurrency,
    amount: initialAmount,
    id: currencies[0].id
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (currency: Currency) => {
    setValue((prevState) => {
      const newValue = { ...prevState, currency: currency.symbol, id: currency.id };
      if (onValueChange) {
        onValueChange(newValue);
      }
      return newValue;
    });
    setIsOpen(false);
  };

  const valueToDisplay = value
    ? { amount: value, currency: insideValue.currency }
    : insideValue;

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
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
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
      className="w-full relative border rounded-xl cursor-pointer">
      <div className="w-full flex flex-col px-3 py-1">
        {insideValue.amount && label && (
          <span className="text-sm text-gray-500 mb-1">{label}</span>
        )}
        <div className="flex items-center w-full">
          <input
            type="text"
            className="flex-1 p-2 px-0 border-none outline-none"
            value={valueToDisplay.amount}
            readOnly={readOnly}
            placeholder={!insideValue.amount ? placeholder : ''}
            onChange={handleAmountChange}
          />
          <div className="flex items-center space-x-1" onClick={toggleDropdown}>
            {currencies.find((c) => c.symbol === valueToDisplay.currency)
              ?.icon}
            <span>{valueToDisplay.currency}</span>
            {currencies.length > 1 && <ChevronDown />}
          </div>
        </div>
      </div>
      {isOpen && !selectIsReadOnly && (
        <div className="absolute w-full bg-gray-50 p-2 border rounded-lg shadow-md z-10">
          {currencies.map((currency) => (
            <div
              key={currency.symbol}
              className="flex justify-between p-2 border-b last:border-b-0 hover:bg-gray-100"
              onClick={() => handleSelect(currency)}>
              <div className="flex items-center space-x-2">
                {currency.icon}
                <span>{currency.symbol}</span>
              </div>
              {currency.symbol === valueToDisplay.currency && <Check />}
            </div>
          ))}
        </div>
      )}
  <input type="hidden" {...props} value={value} />
    </div>
  );
};

export default InputWithSelect;
