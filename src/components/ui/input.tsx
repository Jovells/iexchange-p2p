'use client'

import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, value, onChange, ...props }) => {
  const [inputValue, setInputValue] = useState(value || props.defaultValue || '');
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange(event);
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className="relative w-full h-auto border rounded-xl px-2 py-1">
      {/* Floating label inside the container */}
      <label
        className={`absolute left-2 transition-all duration-200 bg-white px-1 pointer-events-none
          ${inputValue || isFocused ? 'top-1 text-sm text-gray-500' : 'top-1/2 text-lg text-gray-400 transform -translate-y-1/2'}`}
      >
        {label}
      </label>
      
      {/* Input field */}
      <input
        type="text"
        className="w-full pt-4 px-1 pb-1 bg-transparent outline-none text-gray-800"
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    </div>
  );
};

export default Input;
