/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface TextInputProps {
  label?: string;
  name: string;
  register: UseFormRegister<any>;
  required?: boolean;
  errors?: FieldErrors;
  placeholder?: string;
  validation?: any;
  isAutoFocus?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  register,
  errors,
  placeholder,
  validation,
  isAutoFocus,
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
        autoFocus={isAutoFocus}
        {...register(name, { ...validation })}
        placeholder={placeholder}
        className={`appearance-none border rounded w-full py-3 px-4 text-gray-400 leading-tight focus:outline-hidden focus:border-blue-400 ${
          errors && errors[name] ? 'border-red-500' : ''
        }`}
      />
      {errors && errors[name] && (
        <p className="text-red-500 text-xs italic mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

export default TextInput;
