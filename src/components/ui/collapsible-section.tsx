import React, { useState } from 'react';
import { Typography } from './typography';

interface CollapsibleSectionProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  children,
  defaultOpen = true,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={className}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-2 flex justify-between items-center"
      >
        <div className="flex items-center gap-2">
          <svg
            className={`w-5 h-5 transform transition-transform duration-200 ${
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
          <Typography variant="body">{isOpen ? 'Close' : 'Open'}</Typography>
        </div>
      </button>
      <div>{isOpen ? children : null}</div>
    </div>
  );
};
