import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface TextInputProps {
  label?: string;
  name: string;
  register: UseFormRegister<any>;
  required?: boolean;
  errors?: FieldErrors;
  placeholder?: string;
  validation?: any;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  register,
  errors,
  placeholder,
  validation,
}) => {
  const errorMessage =
    errors && errors[name] && (errors[name].message as string);

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-gray-700 font-bold mb-2">
          {label}
          {validation?.required && " *"}
        </label>
      )}
      <input
        id={name}
        {...register(name, { ...validation })}
        placeholder={placeholder}
        className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:border-teal-500 focus:outline-none ${
          errors && errors[name] ? "border-red-500" : ""
        }`}
      />
      {errors && errors[name] && (
        <p className="text-red-500 text-xs italic mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

export default TextInput;
