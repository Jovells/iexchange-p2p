'use client';

import AddPaymentMethod from "@/app/(trade)/(needsAuth)/dashboard/account/payment/AddPaymentMethod";
import { PaymentMethod } from "@/common/api/types";
import { useModal } from "@/common/contexts/ModalContext";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Square } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import Button from "./Button";
import { getImage, getPaymentMethodColor } from "@/lib/utils";

interface PaymentMethodSelectProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  selectedMethod?: PaymentMethod | null;
  initialValue?: string;
  skipStep1?: boolean | PaymentMethod["method"];
  options: PaymentMethod[] | [];
  onValueChange?: (value: PaymentMethod) => void;
  placeholder?: string;
  addButton?: boolean;
  addButtonText?: string;
}

const PaymentMethodSelect: React.FC<PaymentMethodSelectProps> = ({
  label,
  initialValue,
  options,
  selectedMethod,
  onValueChange,
  skipStep1 = false,
  placeholder = "Select",
  addButtonText = "Add New Payment Method",
  addButton,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [_selectedValue, setSelectedValue] = useState(
    selectedMethod ||
      ({
        method: "",
      } as PaymentMethod),
  );
  const selectedValue = selectedMethod !== undefined ? selectedMethod : _selectedValue;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { showModal, hideModal } = useModal();
  const toggleDropdown = () => setIsOpen(!isOpen);
  const queryClient = useQueryClient();

  const handleSelect = (value: PaymentMethod) => {
    setSelectedValue(prevValue => {
      const newValue = value;
      if (onValueChange) {
        onValueChange(newValue);
      }
      return newValue;
    });
    setIsOpen(false);
  };

  const handleAddPaymentMethodClick = () => {
    showModal(
      <AddPaymentMethod
        onSuccess={p => handleSelect(p)}
        method={typeof skipStep1 === "string" ? skipStep1 : undefined}
        hideModal={hideModal}
      />,
    );
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

  const getIc = getImage("add-circle.svg");

  return (
    <div
      ref={dropdownRef}
      className="relative border border-gray-300 dark:border-gray-600 dark:hover:border-[#01a2e4] hover:border-[#01a2e4] rounded-xl cursor-pointer w-full"
    >
      <div className="w-full flex flex-col px-3 py-3">
        {label && selectedValue && <span className="text-sm text-gray-500 dark:text-gray-200">{label}</span>}
        <div className="flex items-center w-full" onClick={toggleDropdown}>
          <div className="flex items-center flex-1 space-x-1">
            {!selectedValue && <span className="text-sm text-gray-500 dark:text-gray-200">{label}</span>}
            {selectedValue?.method ? (
              <div className="flex w-full justify-between">
                <div className="flex items-center space-x-4">
                  <span className="border-l-4 border-blue-500 pl-2 text-gray-800 dark:text-gray-200">
                    {selectedValue.method}
                  </span>
                </div>
                <div className="pr-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <div>{selectedValue.number}</div>
                </div>
              </div>
            ) : (
              <span className="text-gray-400 dark:text-gray-400">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="text-gray-600 dark:text-gray-300" />
        </div>
      </div>
      {isOpen && (
        <div className="absolute w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 rounded-[8px] shadow-md z-10">
          {options.map((option, i) => (
            <div
              key={i}
              className="flex justify-between p-2 border-b border-gray-300 last:border-b-0 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleSelect(option)}
            >
              <div className="flex w-full justify-between">
                <div className="flex items-center space-x-4">
                  {option === selectedValue ? (
                    <Square className="bg-black text-white w-4 h-4 rounded-lg" />
                  ) : (
                    <Square className="text-black dark:text-white w-4 h-4" />
                  )}
                  <span
                    className={`border-l-4 ${getPaymentMethodColor(
                      option.method,
                    )} pl-2 text-gray-800 dark:text-gray-200`}
                  >
                    {option.method}
                  </span>
                </div>
                <div className="min-w-40 text-sm text-gray-500 dark:text-gray-400">
                  <div>{option.name}</div>
                  <div>{option.number}</div>
                  <div>{option.details}</div>
                </div>
              </div>
            </div>
          ))}
          {addButton && (
            <Button
              type="button"
              icon={getIc}
              className="bg-black mt-2 w-full text-white hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-[5px] px-4 py-2"
              text={addButtonText}
              onClick={handleAddPaymentMethodClick}
            />
          )}
        </div>
      )}
      <input type="hidden" {...props} value={selectedValue?.method} />
    </div>
  );
};

export default PaymentMethodSelect;