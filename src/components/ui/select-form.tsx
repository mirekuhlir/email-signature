/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { /* FieldValues, */ Control, Controller } from 'react-hook-form';
import SelectBase from './select-base';

interface SelectProps {
  options: { value: string; label: string }[];
  name: string;
  label?: string;
  control: Control<any>;
  defaultValue?: string;
}

const SelectForm = ({
  options,
  name,
  label,
  control,
  defaultValue,
}: SelectProps) => {
  return (
    <div className="w-full">
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field, fieldState: { error } }) => (
          <>
            <SelectBase
              options={options}
              value={field.value}
              onChange={field.onChange}
              label={label}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">
                {error.message as string}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
};

export default SelectForm;
