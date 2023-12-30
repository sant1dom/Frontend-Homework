import React from 'react';

const SearchBar = ({ placeholder}) => {
    function handleSearch(value) {
        console.log(value);
    }

    return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder || 'Search...'}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-5.2-5.2"
          />
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
};

export default SearchBar;
