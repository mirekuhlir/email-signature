import React, { useState } from 'react';
import { Typography } from './typography';
import { useContentEditStore } from '@/src/store/content-edit-add-path-store';
import { Hr } from './hr';
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
  const { contentEdit } = useContentEditStore();

  return (
    <div className={className}>
      {!contentEdit.subEdit && (
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
      )}
      {isOpen && <Hr className="mb-4" />}
      <div>{isOpen ? children : null}</div>
    </div>
  );
};
