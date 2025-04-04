'use client';

import * as React from 'react';

interface TitleSwitchProps {
  className?: string;
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  leftContent?: React.ReactNode; // Content for the left (unchecked) state
  rightContent?: React.ReactNode; // Content for the right (checked) state
  // Include other relevant props if needed, e.g., name for form submission
  name?: string;
}

const TitleSwitch = React.forwardRef<
  HTMLDivElement, // Ref points to the container div now
  TitleSwitchProps
>(
  (
    {
      className,
      checked = false, // Default to unchecked
      disabled,
      onCheckedChange,
      leftContent,
      rightContent,
      name, // Added name prop
      ...props // Spread remaining props onto the container div
    },
    ref,
  ) => {
    const handleLeftClick = () => {
      if (!disabled) {
        onCheckedChange?.(false);
      }
    };

    const handleRightClick = () => {
      if (!disabled) {
        onCheckedChange?.(true);
      }
    };

    // Base classes for buttons
    const buttonBaseClasses =
      'inline-flex items-center justify-center px-4 py-2 text-sm font-medium cursor-pointer focus:z-10 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-150 ease-in-out';

    // Classes for active/inactive states
    const activeClasses = 'bg-blue-600 text-white';
    const inactiveClasses = 'bg-white text-gray-700 hover:bg-gray-50';

    // Classes for disabled state
    const disabledClasses = 'opacity-50 cursor-not-allowed';

    return (
      <div
        ref={ref} // Attach ref to the container
        className={`inline-flex rounded-md shadow-sm ${className || ''}`}
        role="group" // Accessibility: indicates grouped controls
        {...props} // Spread extra props like aria-label, etc.
      >
        {/* Hidden input for potential form submission compatibility */}
        {name && (
          <input
            type="hidden"
            name={name}
            value={checked ? 'true' : 'false'} // Or adjust value as needed
            disabled={disabled}
          />
        )}

        {/* Left Button */}
        <button
          type="button"
          onClick={handleLeftClick}
          disabled={disabled}
          aria-pressed={!checked} // Accessibility: indicates selection state
          className={`
            flex-1
            min-w-[100px]
            ${buttonBaseClasses}
            rounded-l-md
            ${checked ? inactiveClasses : activeClasses}
            ${disabled ? disabledClasses : ''}
          `}
        >
          {leftContent}
        </button>

        {/* Right Button */}
        <button
          type="button"
          onClick={handleRightClick}
          disabled={disabled}
          aria-pressed={checked} // Accessibility: indicates selection state
          className={`
            flex-1
            min-w-[100px]
            ${buttonBaseClasses}
            -ml-px // Prevent double borders
            rounded-r-md
            ${!checked ? inactiveClasses : activeClasses}
            ${disabled ? disabledClasses : ''}
          `}
        >
          {rightContent}
        </button>
      </div>
    );
  },
);

TitleSwitch.displayName = 'TitleSwitch';

export { TitleSwitch };
