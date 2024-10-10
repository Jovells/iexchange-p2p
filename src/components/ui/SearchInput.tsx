'use client';

import React, { FC } from 'react';
import { Search } from 'lucide-react'; // Replace with your preferred icon library

type SearchInputProps = {
    placeholder?: string;
    initialValue?: string;
    onSearch: (query: string) => void;
    showButton?: boolean;
    buttonText?: string;
    className?: string; // Optional prop to allow for custom styling
};

const SearchInput: FC<SearchInputProps> = ({
    placeholder = 'Search...',
    initialValue = '',
    onSearch,
    showButton = true,
    buttonText = 'Search',
    className = '',
}) => {
    const [query, setQuery] = React.useState<string>(initialValue);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const handleSearch = () => {
        onSearch(query);
    };

    return (
      <div className={`flex items-center border border-gray-300 rounded-md px-3 py-2 w-full ${className}`}>
        {/* Search Icon */}
        <Search className="h-5 w-5 text-gray-500 mr-2" />

        {/* Search Input */}
        <input
          type="text"
          placeholder={placeholder}
          className="flex-grow outline-none bg-transparent"
          value={query}
          onChange={handleInputChange}
        />

        {/* Optional Search Button */}
        {showButton && (
          <button
            onClick={handleSearch}
            className="text-white bg-blue-500 hover:bg-[#01a2e4] px-3 py-1 rounded-md ml-2"
          >
            {buttonText}
          </button>
        )}
      </div>
    );
};

export default SearchInput;
