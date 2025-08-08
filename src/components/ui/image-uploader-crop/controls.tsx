'use client';
import {
  Button,
  baseStyles,
  sizes,
  variants,
} from '@/src/components/ui/button';
import { Typography } from '../typography';
import Slider from '../slider';
import { SliderDimensions, EEditType } from '../slider-dimensions';
import {
  MIN_IMAGE_WIDTH,
  MAX_IMAGE_WIDTH,
} from '@/supabase/functions/_shared/const';
import React from 'react';

interface ImageDropZoneProps {
  isDesktop: boolean;
  isDragging: boolean;
  onDragEnter?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ImageDropZone({
  isDesktop,
  isDragging,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
}: ImageDropZoneProps) {
  return (
    <div
      className={`grid place-items-center p-4 border border-dashed ${isDragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300'} rounded min-h-[200px] w-[80%] md:w-[400px] mx-auto transition-colors duration-200`}
      onDragEnter={isDesktop ? onDragEnter : undefined}
      onDragOver={isDesktop ? onDragOver : undefined}
      onDragLeave={isDesktop ? onDragLeave : undefined}
      onDrop={isDesktop ? onDrop : undefined}
    >
      <div className="flex flex-col items-center space-y-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <Typography variant="body" className="text-center">
          {isDesktop
            ? isDragging
              ? 'Drop image here'
              : 'Drag and drop an image here, or'
            : 'Select an image to upload'}
        </Typography>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
        />
        <label
          htmlFor="file-upload"
          className={`${baseStyles} ${variants.orange} ${sizes.md} cursor-pointer`}
        >
          Select image
        </label>
      </div>
    </div>
  );
}

interface WidthSliderControlProps {
  previewWidth?: number;
  isResizing: boolean;
  onChange: (value: number) => void;
}

export function WidthSliderControl({
  previewWidth,
  isResizing,
  onChange,
}: WidthSliderControlProps) {
  if (!previewWidth) return null;
  return (
    <div className="pb-3">
      <Slider
        label={`Width of image: ${previewWidth} px`}
        min={MIN_IMAGE_WIDTH}
        max={MAX_IMAGE_WIDTH}
        units="pixels"
        defaultValue={previewWidth}
        onChange={onChange}
        id="slider"
        isDisabled={isResizing}
      />
    </div>
  );
}

interface AspectRatioSelectorProps {
  isCircular: boolean;
  aspect: number | undefined;
  onSelectAspect: (aspect: number, circular?: boolean) => void;
  onSelectFree: () => void;
}

export function AspectRatioSelector({
  isCircular,
  aspect,
  onSelectAspect,
  onSelectFree,
}: AspectRatioSelectorProps) {
  return (
    <div className="mb-4">
      <Typography variant="labelBase">Select aspect ratio</Typography>
      <div className="flex flex-wrap gap-y-4 gap-x-8">
        <Button
          size="md"
          variant="outline"
          onClick={() => onSelectAspect(1, false)}
          selected={!isCircular && aspect === 1}
        >
          1:1
        </Button>
        <Button
          size="md"
          variant="outline"
          onClick={() => onSelectAspect(3 / 2, false)}
          selected={!isCircular && aspect === 3 / 2}
        >
          3:2
        </Button>
        <Button
          size="md"
          variant="outline"
          onClick={() => onSelectAspect(2 / 3, false)}
          selected={!isCircular && aspect === 2 / 3}
        >
          2:3
        </Button>
        <Button
          size="md"
          variant="outline"
          onClick={() => onSelectAspect(1, true)}
          selected={isCircular}
        >
          Circular
        </Button>
        <Button
          size="md"
          variant="outline"
          onClick={onSelectFree}
          selected={!isCircular && aspect === undefined}
        >
          Free
        </Button>
      </div>
    </div>
  );
}

interface BorderRadiusControlsProps {
  isDisabled: boolean;
  maxRadius: number;
  values: {
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
  };
  onTopLeft: (v: number) => void;
  onTopRight: (v: number) => void;
  onBottomLeft: (v: number) => void;
  onBottomRight: (v: number) => void;
  onPointerStart?: () => void;
  onPointerEnd?: () => void;
}

export function BorderRadiusControls({
  isDisabled,
  maxRadius,
  values,
  onTopLeft,
  onTopRight,
  onBottomLeft,
  onBottomRight,
  onPointerStart,
  onPointerEnd,
}: BorderRadiusControlsProps) {
  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <SliderDimensions
              label={`Top Left: ${values.topLeft} px`}
              min={0}
              max={maxRadius}
              units="px"
              value={values.topLeft}
              onChange={onTopLeft}
              id="border-radius-slider-tl"
              isDisabled={isDisabled}
              editType={EEditType.CORNER}
              onPointerStart={onPointerStart}
              onPointerEnd={onPointerEnd}
            />
          </div>
          <div>
            <SliderDimensions
              label={`Top Right: ${values.topRight} px`}
              min={0}
              max={maxRadius}
              units="px"
              value={values.topRight}
              onChange={onTopRight}
              id="border-radius-slider-tr"
              isDisabled={isDisabled}
              editType={EEditType.CORNER}
              onPointerStart={onPointerStart}
              onPointerEnd={onPointerEnd}
            />
          </div>
          <div>
            <SliderDimensions
              label={`Bottom Left: ${values.bottomLeft} px`}
              min={0}
              max={maxRadius}
              units="px"
              value={values.bottomLeft}
              onChange={onBottomLeft}
              id="border-radius-slider-bl"
              isDisabled={isDisabled}
              editType={EEditType.CORNER}
              onPointerStart={onPointerStart}
              onPointerEnd={onPointerEnd}
            />
          </div>
          <div>
            <SliderDimensions
              label={`Bottom Right: ${values.bottomRight} px`}
              min={0}
              max={maxRadius}
              units="px"
              value={values.bottomRight}
              onChange={onBottomRight}
              id="border-radius-slider-br"
              isDisabled={isDisabled}
              editType={EEditType.CORNER}
              onPointerStart={onPointerStart}
              onPointerEnd={onPointerEnd}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
