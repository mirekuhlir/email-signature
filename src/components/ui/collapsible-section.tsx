import React, { useState } from 'react';
import { Typography } from './typography';
import { useContentEditStore } from '@/src/store/content-edit-add-path-store';

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

  const { editingSectionIds } = useContentEditStore();
  const isDisabled = editingSectionIds.length > 0;

  return (
    <div className={className}>
      <button
        onClick={() => {
          if (!isDisabled) {
            setIsOpen(!isOpen);
          }
        }}
        className={`w-full py-1 px-2 flex justify-between items-center mt-2 mb-2 bg-gray-200 rounded-md ${
          isDisabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'
        }`}
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
          <span className="flex items-center gap-2">
            <Typography
              textColor={isOpen ? 'text-gray-900' : '"'}
              variant="body"
            >
              {title}
            </Typography>
          </span>
        </div>
      </button>
      <div>{isOpen ? children : null}</div>
    </div>
  );
};
