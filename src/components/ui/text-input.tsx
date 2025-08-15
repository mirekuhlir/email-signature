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
  prefix?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  register,
  errors,
  placeholder,
  validation,
  isAutoFocus,
  prefix,
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
      {prefix ? (
        <div
          className={`flex border border-gray-300 rounded overflow-hidden focus-within:border-blue-400 ${
            errors && errors[name]
              ? 'border-red-500 focus-within:border-red-500'
              : ''
          }`}
        >
          <div className="bg-gray-100 border-r border-gray-300 px-3 py-3 text-gray-600 text-md whitespace-nowrap flex items-center">
            {prefix}
          </div>
          <input
            id={name}
            autoFocus={isAutoFocus}
            autoCapitalize="off"
            {...register(name, { ...validation })}
            placeholder={placeholder}
            className="appearance-none w-full py-3 px-3 text-gray-800 leading-tight focus:outline-none focus:ring-0 border-0"
          />
        </div>
      ) : (
        <input
          id={name}
          autoFocus={isAutoFocus}
          autoCapitalize="off"
          {...register(name, { ...validation })}
          placeholder={placeholder}
          className={`appearance-none border border-gray-300 rounded w-full py-3 px-3 text-gray-800 leading-tight focus:outline-hidden focus:border-blue-400 ${
            errors && errors[name] ? 'border-red-500' : ''
          }`}
        />
      )}
      {errors && errors[name] && (
        <p className="text-red-500 text-xs italic mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

export default TextInput;
