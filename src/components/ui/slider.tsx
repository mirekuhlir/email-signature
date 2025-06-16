'use client';

import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Typography } from './typography';
import Modal from './modal';
import { Button } from './button';

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
  isDisabled?: boolean;
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
    isDisabled,
  } = props;

  const isUsingSteps = 'steps' in props;
  const sliderRef = useRef<HTMLDivElement>(null);

  const thumbRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

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
      if (sliderRef.current && !isDisabled) {
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
    [isUsingSteps, max, min, onChange, step, steps, value, isDisabled],
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

  const handleModalSubmit = () => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      if (isUsingSteps) {
        // Find closest step value
        const closestStep = steps!.reduce((prev, curr) =>
          Math.abs(curr.value - numValue) < Math.abs(prev.value - numValue)
            ? curr
            : prev,
        );
        if (value !== undefined) {
          onChange?.(closestStep.value);
        } else {
          setInternalValue(closestStep.value);
          onChange?.(closestStep.value);
        }
      } else {
        // Clamp value to min/max bounds
        const clampedValue = Math.max(
          min as number,
          Math.min(max as number, numValue),
        );
        if (value !== undefined) {
          onChange?.(clampedValue);
        } else {
          setInternalValue(clampedValue);
          onChange?.(clampedValue);
        }
      }
    }
    setIsModalOpen(false);
    setInputValue('');
  };

  return (
    <div className="pt-3">
      {label && (
        <div className="mb-4">
          <Typography variant="labelBase">{label}</Typography>
        </div>
      )}
      <div className="flex flex-row">
        <div
          id={id}
          ref={sliderRef}
          className={`relative w-full h-4 select-none px-4 ${
            isDisabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{ touchAction: 'none' }}
          role="slider"
          aria-valuemin={isUsingSteps ? steps![0].value : min}
          aria-valuemax={isUsingSteps ? steps![steps!.length - 1].value : max}
          aria-valuenow={currentValue}
          aria-disabled={isDisabled}
        >
          <div
            className={`absolute left-4 right-4 h-2 rounded-full transform -translate-y-1/2 ${
              isDisabled ? 'bg-gray-200' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-0 left-0 h-full rounded-full ${
                isDisabled ? 'bg-gray-400' : 'bg-blue-500'
              }`}
              style={{ width: `${percentValue}%` }}
            />
          </div>
          <div
            ref={thumbRef}
            style={{
              left: `calc(16px + (100% - 32px) * ${percentValue / 100})`,
              touchAction: 'none',
            }}
            className={`absolute w-8 h-8 bg-white border-2 rounded-full shadow-sm transform -translate-y-1/2 -translate-x-1/2 ${
              isDisabled
                ? 'border-gray-400 cursor-not-allowed'
                : 'border-blue-500 cursor-grab active:cursor-grabbing'
            }`}
            onPointerDown={(e) => {
              if (!isDisabled) {
                isDraggingRef.current = true;
                (e.target as HTMLElement).setPointerCapture(e.pointerId);
              }
            }}
            onPointerMove={(e) => {
              if (isDraggingRef.current && !isDisabled) {
                handleMove(e.clientX);
              }
            }}
            onPointerUp={(e) => {
              if (isDraggingRef.current) {
                isDraggingRef.current = false;
                (e.target as HTMLElement).releasePointerCapture(e.pointerId);
              }
            }}
            onLostPointerCapture={() => {
              isDraggingRef.current = false;
            }}
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

        <div className="pl-2 relative -top-4">
          <Button
            variant="blue"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            disabled={isDisabled}
          >
            Edit
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Enter Value"
        size="small"
      >
        <div className="space-y-4">
          <div>
            <Typography variant="labelBase">
              Value{' '}
              {isUsingSteps
                ? `(${steps![0].value} - ${steps![steps!.length - 1].value})`
                : `(${min} - ${max})`}
              :
            </Typography>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              min={isUsingSteps ? steps![0].value : min}
              max={isUsingSteps ? steps![steps!.length - 1].value : max}
              step={isUsingSteps ? 1 : step}
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter number..."
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setInputValue('');
              }}
            >
              Cancel
            </Button>
            <Button variant="blue" onClick={handleModalSubmit}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Slider;
