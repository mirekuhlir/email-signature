"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";

interface Step {
  label: string;
  value: number;
}

interface SliderPropsWithSteps {
  steps: Step[];
  defaultValue?: number;
  onChange?: (value: number) => void;
  value?: number;
}

interface SliderPropsWithRange {
  min: number;
  max: number;
  step?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  value?: number;
}

type SliderProps = SliderPropsWithSteps | SliderPropsWithRange;

const Slider: React.FC<SliderProps> = (props) => {
  const isUsingSteps = "steps" in props;
  const sliderRef = useRef<HTMLDivElement>(null);

  const getInitialValue = () => {
    return isUsingSteps
      ? (props.defaultValue ?? props.steps[0].value)
      : (props.defaultValue ?? props.min);
  };

  // TODO - je potřeba interní hodnota?

  const [internalValue, setInternalValue] = useState(getInitialValue());
  const currentValue = props.value !== undefined ? props.value : internalValue;

  const handleMove = (clientX: number) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const percent = (clientX - rect.left) / rect.width;
      let newValue: number;
      if (isUsingSteps) {
        const index = Math.round(percent * (props.steps.length - 1));
        newValue = props.steps[index].value;
      } else {
        const step = props.step ?? 1;
        const rawValue = percent * (props.max - props.min) + props.min;
        newValue = Math.round(rawValue / step) * step;
        newValue = Math.max(props.min, Math.min(props.max, newValue));
      }
      if (props.value !== undefined) {
        props.onChange && props.onChange(newValue);
      } else {
        setInternalValue(newValue);
        props.onChange && props.onChange(newValue);
      }
    }
  };

  // Tuto funkci budeme volat v našem neregistrovaném listeneru
  const handleTouchMove = (e: TouchEvent) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  const getPercentValue = () => {
    if (isUsingSteps) {
      return (
        ((currentValue - props.steps[0].value) /
          (props.steps[props.steps.length - 1].value - props.steps[0].value)) *
        100
      );
    } else {
      return ((currentValue - props.min) / (props.max - props.min)) * 100;
    }
  };

  const percentValue = getPercentValue();

  useEffect(() => {
    const sliderElem = sliderRef.current;
    if (sliderElem) {
      sliderElem.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      return () => {
        sliderElem.removeEventListener("touchmove", handleTouchMove);
      };
    }
  }, [sliderRef]);

  return (
    <div
      ref={sliderRef}
      className="relative w-full h-20 select-none"
      style={{ touchAction: "none" }}
      onMouseMove={handleMouseMove}
      role="slider"
      aria-valuemin={isUsingSteps ? props.steps[0].value : props.min}
      aria-valuemax={
        isUsingSteps ? props.steps[props.steps.length - 1].value : props.max
      }
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
