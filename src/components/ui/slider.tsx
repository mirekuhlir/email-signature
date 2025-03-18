'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { Typography } from './typography';

interface Step {
  label: string;
  value: number;
}

interface SliderProps {
  id?: string;
  min?: number;
  max?: number;
  step?: number;
  steps?: Step[];
  defaultValue?: number;
  onChange?: (value: number) => void;
  value?: number;
  units?: string;
  showValues?: boolean;
  label?: string;
  showValue?: boolean;
}

const Slider: React.FC<SliderProps> = (props) => {
  const {
    id,
    defaultValue,
    onChange,
    value,
    min,
    max,
    step,
    steps,
    label,
    showValue,
  } = props;

  const isUsingSteps = 'steps' in props;
  const sliderRef = useRef<HTMLDivElement>(null);

  const getInitialValue = useCallback((): number => {
    return isUsingSteps
      ? defaultValue !== undefined
        ? defaultValue
        : steps![0].value
      : defaultValue !== undefined
        ? defaultValue
        : min !== undefined
          ? min
          : 0;
  }, [isUsingSteps, defaultValue, steps, min]);

  const [internalValue, setInternalValue] = useState<number>(getInitialValue());
  const currentValue = value !== undefined ? value : internalValue;

  const handleMove = useCallback(
    (clientX: number) => {
      if (sliderRef.current) {
        const rect = sliderRef.current.getBoundingClientRect();
        const padding = 16; // 1rem = 16px
        const width = rect.width - padding * 2;
        const percent = Math.max(
          0,
          Math.min(1, (clientX - (rect.left + padding)) / width),
        );
        let newValue: number;
        if (isUsingSteps) {
          const index = Math.round(percent * (steps!.length - 1));
          newValue = steps![index].value;
        } else {
          const stepValue = step ?? 1;
          const rawValue =
            percent * ((max as number) - (min as number)) + (min as number);
          newValue = Math.round(rawValue / stepValue) * stepValue;
          newValue = Math.max(min as number, Math.min(max as number, newValue));
        }
        if (value !== undefined) {
          onChange?.(newValue);
        } else {
          setInternalValue(newValue);
          onChange?.(newValue);
        }
      }
    },
    [isUsingSteps, props],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.cancelable) {
        e.preventDefault();
      }
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    },
    [handleMove],
  );

  const getPercentValue = useCallback((): number => {
    if (isUsingSteps && steps && steps.length > 0) {
      return (
        ((currentValue - steps[0].value) /
          (steps[steps.length - 1].value - steps[0].value)) *
        100
      );
    } else if (!isUsingSteps && min !== undefined && max !== undefined) {
      return (
        ((currentValue - (min as number)) /
          ((max as number) - (min as number))) *
        100
      );
    }
    return 0;
  }, [currentValue, isUsingSteps, steps, min, max]);

  const percentValue = useMemo(() => getPercentValue(), [getPercentValue]);

  useEffect(() => {
    const sliderElem = sliderRef.current;
    if (sliderElem) {
      sliderElem.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      });
      return () => {
        sliderElem.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [handleTouchMove]);

  return (
    <div className="pt-3">
      {label && <Typography variant="labelBase">{label}</Typography>}
      <div
        id={id}
        ref={sliderRef}
        className="relative w-full h-4 select-none px-4"
        style={{ touchAction: 'none' }}
        onPointerDown={(e) => sliderRef.current?.setPointerCapture(e.pointerId)}
        onPointerMove={(e) => {
          if (e.buttons === 1) {
            handleMove(e.clientX);
          }
        }}
        role="slider"
        aria-valuemin={isUsingSteps ? steps![0].value : min}
        aria-valuemax={isUsingSteps ? steps![steps!.length - 1].value : max}
        aria-valuenow={currentValue}
      >
        <div className="absolute left-4 right-4 h-2 bg-gray-300 rounded-full transform -translate-y-1/2">
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
            style={{ width: `${percentValue}%` }}
          />
        </div>
        <div
          className="absolute w-8 h-8 bg-white border-2 border-blue-500 rounded-full shadow-sm transform -translate-y-1/2 -translate-x-1/2 cursor-pointer"
          style={{ left: `calc(16px + (100% - 32px) * ${percentValue / 100})` }}
        />
        <div className="absolute top-full left-0 w-full flex justify-between mt-2 text-xs text-gray-600">
          {isUsingSteps && steps
            ? steps.map((step, index) => (
                <span key={index} className="flex-1 text-center">
                  {step.label}
                </span>
              ))
            : showValue && (
                <span className="w-full text-center text-sm font-bold text-gray-700">
                  {`${currentValue} ${props.units ?? ''}`}
                </span>
              )}
        </div>
      </div>
    </div>
  );
};

export default Slider;
