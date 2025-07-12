'use client';

import * as React from 'react';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      label,
      id: propId,
      checked,
      disabled,
      onCheckedChange,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId(); // Call useId unconditionally
    const finalId = propId || generatedId; // Use propId if provided, otherwise use generatedId

    const handleCheckedChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      onCheckedChange?.(event.target.checked);
    };

    const labelBaseClasses =
      'relative inline-flex items-center h-8 w-16 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out';
    const labelBgFocusClasses =
      'bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2';
    const labelCheckedClasses = 'peer-checked:bg-blue-600';
    const labelDisabledClasses =
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-50';

    const thumbBaseClasses =
      'pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out';
    const thumbCheckedPosition = checked ? 'translate-x-8' : 'translate-x-0';

    return (
      <div className={`flex items-center ${className || ''}`}>
        <div className="flex items-center">
          <input
            type="checkbox"
            id={finalId}
            ref={ref}
            checked={checked}
            disabled={disabled}
            onChange={handleCheckedChange}
            className="sr-only peer" // Hide default checkbox but keep accessible
            {...props}
          />
          <label
            htmlFor={finalId}
            className={`${
              labelBaseClasses
            } ${labelBgFocusClasses} ${labelCheckedClasses} ${labelDisabledClasses}`}
          >
            <span className={`${thumbBaseClasses} ${thumbCheckedPosition}`} />
          </label>
        </div>
        {label && (
          <label
            htmlFor={finalId}
            className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
    );
  },
);

Switch.displayName = 'Switch';

export { Switch };
