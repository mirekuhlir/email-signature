import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { Typography } from './typography';

interface Option {
  value: string;
  label: string | ReactNode;
}

interface CustomSelectProps {
  options: Option[];
  onChange: (value: string) => void;
  value?: string;
  label?: string | ReactNode;
}

const SelectBase: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const selectedOptionRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && selectedOptionRef.current && listRef.current) {
      if (listRef.current.scrollHeight > listRef.current.clientHeight) {
        // Calculate position to show selected option slightly above the bottom
        const listRect = listRef.current.getBoundingClientRect();
        const selectedRect = selectedOptionRef.current.getBoundingClientRect();
        const optionHeight = selectedRect.height;
        const listHeight = listRect.height;

        // Position selected option so there's space for ~1.5 more options below it
        const offsetFromBottom = optionHeight * 1.5;
        const targetScrollTop =
          selectedOptionRef.current.offsetTop - (listHeight - offsetFromBottom);

        listRef.current.scrollTop = Math.max(0, targetScrollTop);
      }
    }
  }, [isOpen]);

  const handleOptionClick = (option: Option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="flex flex-col">
      {label ? <Typography variant="labelBase">{label}</Typography> : null}
      <div ref={selectRef} className="relative inline-block">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full bg-white border border-gray-300 rounded-md shadow-xs pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-hidden focus:border-blue-400"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="block truncate">
            {selectedOption ? selectedOption.label : 'Select an option'}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            {isOpen ? (
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M14.77 12.79a.75.75 0 01-1.06-.02L10 9.414l-3.71 3.356a.75.75 0 11-1.04-1.088l4.25-3.843a.75.75 0 011.04 0l4.25 3.843a.75.75 0 01.02 1.06z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.586l3.71-3.356a.75.75 0 111.04 1.088l-4.25 3.843a.75.75 0 01-1.04 0l-4.25-3.843a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </span>
        </button>
        {isOpen && (
          <ul
            ref={listRef}
            className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-gray-300 ring-opacity-5 overflow-auto focus:outline-hidden"
            role="listbox"
            tabIndex={-1}
          >
            {options.map((option) => (
              <li
                key={option.value}
                ref={option.value === value ? selectedOptionRef : null}
                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                  option.value === value
                    ? 'text-white bg-blue-600'
                    : 'text-gray-900 hover:bg-blue-100'
                }`}
                onClick={() => handleOptionClick(option)}
                role="option"
                aria-selected={option.value === value}
              >
                <span
                  className={`block truncate ${option.value === value ? 'font-semibold' : 'font-normal'}`}
                >
                  {option.label}
                </span>
                {option.value === value && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SelectBase;
