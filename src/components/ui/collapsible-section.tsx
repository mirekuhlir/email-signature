import React, { useState } from 'react';
import { Typography } from './typography';
interface CollapsibleSectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  isInitOpen?: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  children,
  className = '',
  title = '',
  isInitOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(isInitOpen);

  return (
    <div className={className}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-2 px-2 flex justify-between items-center mt-4 mb-4 bg-gray-200 rounded-md"
      >
        <div className="flex items-center gap-2">
          <svg
            className={`w-6 h-6 transform transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <Typography variant="body">{`${isOpen ? 'Close' : 'Open'} ${
            title ? ` - ${title}` : ''
          }`}</Typography>
        </div>
      </button>
      <div>{isOpen ? children : null}</div>
    </div>
  );
};
