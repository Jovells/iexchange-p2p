"use client";

import CryptoButton from "@/app/(trade)/cryptoButton";
import { Token } from "@/common/api/types";
import { getPaymentMethodColor } from "@/lib/utils";
import { Check, ChevronDown, Square } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

interface InputSelectProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  initialValue?: Token;
  options: Token[];
  showBalance?: boolean;
  onValueChange?: (value: Token | undefined) => void;
  placeholder?: string;
  selectType?: string;
  column?: boolean;
}

const Select: React.FC<InputSelectProps> = ({
  width,
  label,
  initialValue,
  options,
  column,
  onValueChange,
  showBalance = true,
  placeholder = "All Tokens",
  selectType = "payment method",
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const dropdownRef = useRef<HTMLDivElement>(null);

  console.log("qj selectedValue", selectedValue);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (value: Token) => {
    console.log("qj handleSelect", value);
    setSelectedValue(prevValue => {
      const newValue = value;
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
      className="relative border border-gray-300 dark:border-gray-600 rounded-[8px] cursor-pointer w-full transition-all duration-300 ease-in-out hover:border-[#01a2e4] hover:dark:border-[#01a2e4]"
    >
      <div className="w-full flex flex-col">
        {label && selectedValue && <span className="text-sm text-gray-500">{label}</span>}
        <div
          className={`flex items-center w-full p-3 ${
            selectedValue ? "py-[10px]" : "py-[14px]"
          } transition-all duration-300 ease-in-out`}
          onClick={toggleDropdown}
        >
          <div className="flex items-center flex-1 space-x-2">
            {!selectedValue && <span className="text-sm text-gray-500">{label}</span>}
            <span className={`text-black dark:text-white   w-[${width}px : "w-full"}`}>
              {selectedValue ? (
                showBalance && selectedValue.id !== "0x0" ? (
                  <CryptoButton column={column} token={selectedValue} />
                ) : (
                  selectedValue.symbol
                )
              ) : (
                <span className="text-gray-400">{placeholder}</span>
              )}
            </span>
          </div>
          <ChevronDown className="text-gray-500" />
        </div>
      </div>
      {isOpen && (
        <div className="absolute w-full min-w-44 bg-white dark:bg-gray-700 p-2 border border-gray-200 dark:border-gray-600 rounded-[8px] shadow-md z-10 transition-all duration-300 ease-in-out">
          {options.map(option => {
            return (
              <div
                key={option?.id || "all"}
                className="flex justify-between p-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-all duration-300 ease-in-out"
                //@ts-ignore
                onClick={() => handleSelect(option)}
              >
                {option.id === "0x0" ? option.symbol : <CryptoButton token={option} selectedCrypto={selectedValue} />}
              </div>
            );
          })}
        </div>
      )}
      <input type="hidden" {...props} value={selectedValue?.id} />
    </div>
  );
};

export default Select;
