/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { UseFormRegister, FieldValues, FieldErrors } from 'react-hook-form';

interface SelectProps<TFormValues extends FieldValues> {
  options: { value: string; label: string }[];
  name: string;
  label?: string;
  register: UseFormRegister<any>;
  errors?: FieldErrors<TFormValues>;
  defaultValue?: string;
  className?: string;
}

const SelectForm = <TFormValues extends FieldValues>({
  options,
  name,
  label,
  register,
  errors,
  defaultValue,
  className,
}: SelectProps<TFormValues>) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <select
          {...register(name)}
          defaultValue={defaultValue}
          className={`block appearance-none w-full bg-white border ${
            errors?.[name]
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          } hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-hidden focus:ring-1 ${className}`}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-white text-gray-900"
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
      {errors?.[name] && (
        <p className="mt-1 text-sm text-red-600">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default SelectForm;
