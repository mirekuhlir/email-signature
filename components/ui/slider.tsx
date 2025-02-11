"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";

interface Step {
  label: string;
  value: number;
}

interface SliderProps {
  defaultValue?: number;
  onChange?: (value: number) => void;
  steps?: Step[];
  min?: number;
  max?: number;
  step?: number;
}

const Slider: React.FC<SliderProps> = (props) => {
  const { defaultValue, onChange, steps, min, max, step } = props;
  const isUsingSteps = steps !== undefined && steps.length > 0;
  const sliderRef = useRef<HTMLDivElement>(null);

  const getInitialValue = useCallback((): number => {
    if (isUsingSteps) {
      return defaultValue ?? steps![0].value;
    } else {
      return defaultValue ?? min ?? 0;
    }
  }, [defaultValue, isUsingSteps, min, steps]);

  const [internalValue, setInternalValue] = useState<number>(getInitialValue());
  const currentValue = internalValue;

  const handleMove = useCallback(
    (clientX: number) => {
      if (sliderRef.current) {
        const rect = sliderRef.current.getBoundingClientRect();
        const percent = (clientX - rect.left) / rect.width;
        let newValue: number;
        if (isUsingSteps) {
          const index = Math.round(percent * (steps!.length - 1));
          newValue = steps![index].value;
        } else {
          const _min = min ?? 0;
          const _max = max ?? 100;
          const _step = step ?? 1;
          const rawValue = percent * (_max - _min) + _min;
          newValue = Math.round(rawValue / _step) * _step;
          newValue = Math.max(_min, Math.min(_max, newValue));
        }
        setInternalValue(newValue);
        onChange?.(newValue);
      }
    },
    [isUsingSteps, max, min, onChange, step, steps],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (e.buttons === 1) {
        handleMove(e.clientX);
      }
    },
    [handleMove],
  );

  const getPercentValue = useCallback((): number => {
    if (isUsingSteps) {
      return (
        ((currentValue - steps![0].value) /
          (steps![steps!.length - 1].value - steps![0].value)) *
        100
      );
    } else {
      const _min = min ?? 0;
      const _max = max ?? 100;
      return ((currentValue - _min) / (_max - _min)) * 100;
    }
  }, [currentValue, isUsingSteps, max, min, steps]);

  const percentValue = useMemo(() => getPercentValue(), [getPercentValue]);

  return (
    <div className="pb-10">
      <div
        ref={sliderRef}
        className="relative w-full select-none"
        style={{ touchAction: "none" }}
        onMouseMove={handleMouseMove}
        role="slider"
        aria-valuemin={isUsingSteps ? steps![0].value : min}
        aria-valuemax={isUsingSteps ? steps![steps!.length - 1].value : max}
        aria-valuenow={currentValue}
      >
        <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-300 rounded-full transform -translate-y-1/2">
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
            style={{ width: `${percentValue}%` }}
          />
        </div>
        <div
          className="absolute top-1/2 w-8 h-8 bg-white border-2 border-blue-500 rounded-full shadow transform -translate-y-1/2 -translate-x-1/2 cursor-pointer"
          style={{ left: `${percentValue}%` }}
        />
        <div className="absolute top-4 left-0 w-full flex justify-between mt-2 text-xs text-gray-600">
          {isUsingSteps ? (
            steps!.map((step, index) => (
              <span
                key={index}
                className="flex-1 text-center text-sm font-bold text-gray-700 px-1"
              >
                {step.label}
              </span>
            ))
          ) : (
            <>
              <span className="text-center text-sm font-bold text-gray-700">
                {min}
              </span>
              <span className="text-center text-sm font-bold text-gray-700">
                {max}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Slider;
