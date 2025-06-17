/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface NumberInputProps {
  label?: string;
  name: string;
  register: UseFormRegister<any>;
  required?: boolean;
  errors?: FieldErrors;
  placeholder?: string;
  validation?: any;
  isAutoFocus?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

const NumberInput: React.FC<NumberInputProps> = ({
  label,
  name,
  register,
  errors,
  placeholder,
  validation,
  isAutoFocus,
  step,
}) => {
  const errorMessage =
    errors && errors[name] && (errors[name].message as string);

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className="block text-base font-medium text-gray-600"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        type="number"
        autoFocus={isAutoFocus}
        step={step}
        {...register(name, {
          ...validation,
          valueAsNumber: true,
        })}
        placeholder={placeholder}
        className={`appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-hidden focus:border-blue-400 ${
          errors && errors[name] ? 'border-red-500' : ''
        }`}
      />
      {errors && errors[name] && (
        <p className="text-red-500 text-xs italic mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

export default NumberInput;
