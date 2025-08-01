'use client';

import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Typography } from './typography';
import Modal from './modal';
import { Button } from './button';
import NumberInput from './number-input';

interface Step {
  label: string;
  value: number;
}

export interface SliderProps {
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
  spaces?: string[];
  corners?: string[];
  borders?: string[];
  onSubmit?: (value: number) => void;
  modalContent?: React.ReactNode;
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
    onSubmit,
    modalContent,
  } = props;

  const isUsingSteps = 'steps' in props;
  const sliderRef = useRef<HTMLDivElement>(null);

  const thumbRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<{ value: number }>({
    defaultValues: { value: 0 },
  });

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
    [isDisabled, isUsingSteps, value, steps, step, max, min, onChange],
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

  const handleModalSubmit = form.handleSubmit((data) => {
    onSubmit?.(data.value);

    const numValue = data.value;
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
    form.reset();
  });

  const openModal = () => {
    form.setValue('value', currentValue);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    form.reset();
  };

  // Callback function to set form value from modal content
  const handleSetValue = (value: number) => {
    form.setValue('value', value);
  };

  // Clone modal content and inject onSetValue prop if it's a React element
  const enhancedModalContent = useMemo(() => {
    if (React.isValidElement(modalContent)) {
      return React.cloneElement(
        modalContent as React.ReactElement<{
          onSetValue?: (value: number) => void;
        }>,
        {
          onSetValue: handleSetValue,
        },
      );
    }
    return modalContent;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalContent]);

  return (
    <>
      {label && <Typography variant="labelBase">{label}</Typography>}
      <div>
        <div className="flex flex-row items-center">
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
              style={{ top: '50%' }}
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
                top: '50%',
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

            {((isUsingSteps && steps) || showValue) && (
              <div className="absolute top-full left-0 w-full flex justify-between text-xs text-gray-600">
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
            )}
          </div>

          <div className="pl-1 pr-0 sm:pr-4">
            <Button
              variant="blue"
              size="sm"
              onClick={openModal}
              disabled={isDisabled}
            >
              Edit
            </Button>
          </div>
        </div>

        <Modal isOpen={isModalOpen} title={label} size="medium">
          <form onSubmit={handleModalSubmit} className="space-y-4">
            <NumberInput
              label={`Value ${
                isUsingSteps
                  ? `(${steps![0].value} - ${steps![steps!.length - 1].value})`
                  : `(${min} - ${max})`
              }`}
              name="value"
              register={form.register}
              errors={form.formState.errors}
              placeholder="Enter number..."
              isAutoFocus={true}
              min={isUsingSteps ? steps![0].value : min}
              max={isUsingSteps ? steps![steps!.length - 1].value : max}
              step={isUsingSteps ? 1 : step}
            />
            {enhancedModalContent}
            <div className="flex justify-between gap-1">
              <Button type="button" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button type="submit" variant="blue">
                Confirm
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default Slider;
