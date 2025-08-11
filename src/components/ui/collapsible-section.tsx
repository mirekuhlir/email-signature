import React, { useEffect, useRef, useState } from 'react';
import { Typography } from './typography';
import { useContentEditStore } from '@/src/store/content-edit-add-path-store';

interface CollapsibleSectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  isInitOpen?: boolean;
  panelContent?: React.ReactNode;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  children,
  className = '',
  title = '',
  isInitOpen = false,
  panelContent,
}) => {
  const [isOpen, setIsOpen] = useState(isInitOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [measuredHeight, setMeasuredHeight] = useState<number>(0);

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const measure = () => {
      const nextHeight = element.scrollHeight;
      setMeasuredHeight(nextHeight);
    };

    // Measure immediately
    measure();

    // Re-measure on window resize
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [children]);

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
        aria-expanded={isOpen}
        className={`w-full py-1 px-2 flex justify-between items-center mt-2 mb-2 rounded-md ${
          isOpen ? 'bg-gray-300' : 'bg-gray-200'
        } ${isDisabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'}`}
      >
        <div className="flex items-center gap-2">
          <svg
            className={`w-6 h-6 ${isOpen ? 'text-brand-blue-900' : 'text-gray-700'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Horizontal line (always visible) */}
            <path
              className="transition-colors duration-200 ease-in-out"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 12h14"
            />
            {/* Vertical line (animates in/out to form + / -) */}
            <g
              className={`origin-center transition-all duration-200 ease-in-out ${
                isOpen ? 'scale-y-0 opacity-0' : 'scale-y-100 opacity-100'
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v14"
              />
            </g>
          </svg>

          <span className="flex items-center gap-2">
            <Typography textColor={'text-gray-900'} variant="body">
              {title}
            </Typography>
          </span>
        </div>
        {panelContent && (
          <div className="flex items-center w-full justify-center">
            {panelContent}
          </div>
        )}
      </button>
      <div
        ref={contentRef}
        aria-hidden={!isOpen}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? measuredHeight : 0 }}
      >
        {children}
      </div>
    </div>
  );
};
