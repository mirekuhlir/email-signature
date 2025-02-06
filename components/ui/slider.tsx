"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";

interface Step {
  label: string;
  value: number;
}

interface SliderPropsWithSteps {
  steps: Step[];
  defaultValue?: number;
  onChange?: (value: number) => void;
}

interface SliderPropsWithRange {
  min: number;
  max: number;
  step: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
}

type SliderProps = SliderPropsWithSteps | SliderPropsWithRange;

const Slider: React.FC<SliderProps> = (props) => {
  const isUsingSteps = "steps" in props;
  const { onChange } = props;

  const getInitialValue = () => {
    if (isUsingSteps) {
      return props.defaultValue ?? props.steps[0].value;
    } else {
      return props.defaultValue ?? props.min;
    }
  };

  const [value, setValue] = useState(getInitialValue());
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onChange) {
      onChange(value);
    }
  }, [value, onChange]);

  const handleMove = (clientX: number) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const percent = (clientX - rect.left) / rect.width;

      if (isUsingSteps) {
        const index = Math.round(percent * (props.steps.length - 1));
        setValue(props.steps[index].value);
      } else {
        const newValue = percent * (props.max - props.min) + props.min;
        const steppedValue = Math.round(newValue / props.step) * props.step;
        setValue(Math.max(props.min, Math.min(props.max, steppedValue)));
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  const getPercentValue = () => {
    if (isUsingSteps) {
      return (
        ((value - props.steps[0].value) /
          (props.steps[props.steps.length - 1].value - props.steps[0].value)) *
        100
      );
    } else {
      return ((value - props.min) / (props.max - props.min)) * 100;
    }
  };

  const percentValue = getPercentValue();

  return (
    <div
      ref={sliderRef}
      className="relative w-full h-20 touch-none select-none"
      onTouchMove={handleTouchMove}
      onMouseMove={handleMouseMove}
      onTouchEnd={() => {}}
      onMouseUp={() => {}}
      role="slider"
      aria-valuemin={isUsingSteps ? props.steps[0].value : props.min}
      aria-valuemax={
        isUsingSteps ? props.steps[props.steps.length - 1].value : props.max
      }
      aria-valuenow={value}
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
      <div className="absolute top-full left-0 w-full flex justify-between mt-2 text-xs text-gray-600">
        {isUsingSteps ? (
          props.steps.map((step, index) => (
            <span key={index} className="flex-1 text-center">
              {step.label}
            </span>
          ))
        ) : (
          <>
            <span>{props.min}</span>
            <span>{props.max}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default Slider;
