import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'blue'
    | 'orange'
    | 'red'
    | 'black'
    | 'gray'
    | 'outline'
    | 'ghost'
    | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  selected?: boolean;
}

const LoadingSpinner = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

export const baseStyles =
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

export const variants = {
  blue: 'bg-blue-600 hover:bg-blue-700 text-white',
  orange: 'bg-orange-600 hover:bg-orange-700 text-white',
  red: 'bg-red-600 hover:bg-red-700 text-white',
  black: 'bg-black hover:bg-gray-900 text-white',
  gray: 'bg-gray-600 hover:bg-gray-700 text-white',
  outline: 'border-2 border-current bg-transparent hover:bg-gray-100',
  ghost: 'bg-transparent hover:bg-gray-100',
  link: 'bg-transparent underline-offset-4 hover:underline p-0',
};

export const selectedStyles = {
  blue: 'bg-blue-500 hover:bg-blue-500 text-white',
  orange: 'bg-orange-500 hover:bg-orange-500 text-white',
  red: 'bg-red-500 hover:bg-red-500 text-white',
  black: 'bg-gray-700 hover:bg-gray-700 text-white',
  gray: 'bg-gray-500 hover:bg-gray-500 text-white',
  outline: 'border-2 border-blue-500 bg-blue-50 hover:bg-blue-50',
  ghost: 'bg-gray-50 hover:bg-gray-50',
  link: 'bg-transparent underline-offset-4 hover:underline p-0',
};

export const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-6 text-lg',
  xl: 'h-14 px-8 text-xl',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'blue',
      size = 'md',
      loading,
      disabled,
      selected = false,
      children,
      ...props
    },
    ref,
  ) => {
    const variantClass = selected ? selectedStyles[variant] : variants[variant];

    const buttonClasses = `${baseStyles} ${variantClass} ${sizes[size]}`;

    return (
      <button
        ref={ref}
        className={className || buttonClasses}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <LoadingSpinner />}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
