'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Slider from './slider';

/* const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const parseRgb = (rgbString: string): { r: number; g: number; b: number } => {
  const matches = rgbString.match(/\d+/g);
  return {
    r: parseInt(matches![0]),
    g: parseInt(matches![1]),
    b: parseInt(matches![2]),
  };
}; */

interface HSV {
  h: number;
  s: number;
  v: number;
}

const rgbToHsv = (rgb: string): { h: number; s: number; v: number } => {
  const matches = rgb.match(/rgb\((\d+),?\s*(\d+),?\s*(\d+)\)/);
  if (!matches) {
    return { h: 0, s: 0, v: 0 };
  }

  const r = parseInt(matches[1], 10);
  const g = parseInt(matches[2], 10);
  const b = parseInt(matches[3], 10);

  const r1 = r / 255;
  const g1 = g / 255;
  const b1 = b / 255;

  const max = Math.max(r1, g1, b1);
  const min = Math.min(r1, g1, b1);
  const diff = max - min;

  let h = 0;
  const s = max === 0 ? 0 : diff / max;
  const v = max;

  if (diff !== 0) {
    switch (max) {
      case r1:
        h = (g1 - b1) / diff + (g1 < b1 ? 6 : 0);
        break;
      case g1:
        h = (b1 - r1) / diff + 2;
        break;
      case b1:
        h = (r1 - g1) / diff + 4;
        break;
    }
    h = h / 6;
  }

  return { h, s: Math.round(s * 100), v: Math.round(v * 100) };
};

// Helper function to parse RGB string
const parseRgb = (rgbString: string): { r: number; g: number; b: number } => {
  const matches = rgbString.match(/rgb\((\d+),?\s*(\d+),?\s*(\d+)\)/);
  if (!matches) {
    return { r: 0, g: 0, b: 0 }; // Return default or throw error
  }
  return {
    r: parseInt(matches[1], 10),
    g: parseInt(matches[2], 10),
    b: parseInt(matches[3], 10),
  };
};

// Helper function to format RGB object to string
const formatRgbToString = (rgb: {
  r: number;
  g: number;
  b: number;
}): string => {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
};

interface Props {
  onChange: (color: string) => void;
  initColor: string;
  usedColors?: string[];
}

const AdvancedColorPicker = (props: Props) => {
  const { onChange, initColor, usedColors = [] } = props;

  // Initialize states directly from initColor
  const [rgb, setRgb] = useState(() => parseRgb(initColor));
  const [hsv, setHsv] = useState(() => rgbToHsv(initColor));

  const [isDraggingField, setIsDraggingField] = useState(false);
  const [isDraggingHue, setIsDraggingHue] = useState(false);

  const hsvToRgb = (h: number, s: number, v: number): string => {
    s = s / 100;
    v = v / 100;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    let r = 0,
      g = 0,
      b = 0;
    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }

    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
  };

  // Effect to call onChange when rgb changes
  useEffect(() => {
    onChange(formatRgbToString(rgb));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rgb]); // Depend only on rgb state

  // Add hsvToRgb to useCallback dependency array
  const hsvToRgbCallback = useCallback(hsvToRgb, []);

  const updateColorFromEvent = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
      isField: boolean,
    ) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      let nextHsv: HSV;
      if (isField) {
        const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
        nextHsv = {
          ...hsv,
          s: Math.round(x * 100),
          v: Math.round((1 - y) * 100),
        };
      } else {
        const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        nextHsv = { ...hsv, h: x };
      }

      // Update HSV first
      setHsv(nextHsv);
      // Then sync RGB
      const nextRgbString = hsvToRgbCallback(nextHsv.h, nextHsv.s, nextHsv.v);
      setRgb(parseRgb(nextRgbString));
    },
    [hsv, hsvToRgbCallback], // Use the memoized callback
  );

  const handleFieldInteraction = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    ) => {
      updateColorFromEvent(e, true);
    },
    [updateColorFromEvent],
  );

  const handleHueInteraction = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    ) => {
      updateColorFromEvent(e, false);
    },
    [updateColorFromEvent],
  );

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDraggingField(false);
      setIsDraggingHue(false);
    };

    const handleGlobalMouseMove = (e: MouseEvent | TouchEvent) => {
      if (isDraggingField || isDraggingHue) {
        e.preventDefault();
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('touchmove', handleGlobalMouseMove, {
      passive: false,
    });

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('touchmove', handleGlobalMouseMove);
    };
  }, [isDraggingField, isDraggingHue]);

  // Calculate derived colors based on current states
  const currentColor = formatRgbToString(rgb);
  const hueColor = hsvToRgb(hsv.h, 100, 100);

  // Function to handle RGB slider changes
  const handleRgbChange = useCallback(
    (channel: 'r' | 'g' | 'b', value: number) => {
      // Update RGB first
      const nextRgb = { ...rgb, [channel]: value };
      setRgb(nextRgb);
      // Then sync HSV
      const nextHsv = rgbToHsv(formatRgbToString(nextRgb));
      setHsv(nextHsv);
    },
    [rgb], // Depend on rgb state
  );

  return (
    <div className="w-full">
      <div className="p-6">
        {/* Color field */}
        <div
          className="relative w-full h-64 rounded-lg cursor-crosshair shadow-inner mb-4"
          style={{
            background: `linear-gradient(to right, white, ${hueColor}), 
                        linear-gradient(to bottom, transparent, black)`,
            backgroundBlendMode: 'multiply',
          }}
          onClick={handleFieldInteraction}
          onMouseDown={(e) => {
            setIsDraggingField(true);
            handleFieldInteraction(e);
          }}
          onMouseMove={(e) => isDraggingField && handleFieldInteraction(e)}
          onTouchStart={(e) => {
            setIsDraggingField(true);
            handleFieldInteraction(e);
          }}
          onTouchMove={(e) => isDraggingField && handleFieldInteraction(e)}
        >
          <div
            className="absolute w-8 h-8 border-4 border-white rounded-full -translate-x-4 -translate-y-4 shadow-lg ring-2 ring-blue-500"
            style={{
              left: `${hsv.s}%`,
              top: `${100 - hsv.v}%`,
              backgroundColor: currentColor,
            }}
          />
        </div>
        {/* Hue slider */}
        <div
          className="relative w-full h-16 rounded-lg cursor-pointer shadow-inner"
          style={{
            background:
              'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
          }}
          onClick={handleHueInteraction}
          onMouseDown={(e) => {
            setIsDraggingHue(true);
            handleHueInteraction(e);
          }}
          onMouseMove={(e) => isDraggingHue && handleHueInteraction(e)}
          onTouchStart={(e) => {
            setIsDraggingHue(true);
            handleHueInteraction(e);
          }}
          onTouchMove={(e) => isDraggingHue && handleHueInteraction(e)}
        >
          <div
            className="absolute w-7 h-full border-4 border-white -translate-x-4 shadow-lg ring-2 ring-blue-500"
            style={{
              left: `${hsv.h * 100}%`,
            }}
          />
        </div>
        {usedColors.length > 0 && (
          <div className="mt-4 mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Select color
            </p>
            <div className="flex flex-wrap gap-4">
              {usedColors.map((color, index) => (
                <div
                  key={index}
                  className="w-12 h-12 rounded-md cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    const newRgb = parseRgb(color);
                    const newHsv = rgbToHsv(color);
                    setRgb(newRgb);
                    setHsv(newHsv);
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}
        <div>
          <div
            className="w-full h-16 rounded-lg shadow-inner mt-2"
            style={{ backgroundColor: currentColor }}
          />
          <div className="mt-2 font-mono text-gray-600 text-md text-center">
            {currentColor}
          </div>
        </div>
        <div className="space-y-1 pt-4">
          <Slider
            label={`R: ${rgb.r}`}
            min={0}
            max={255}
            value={rgb.r}
            onChange={(value) => handleRgbChange('r', value)}
          />
          <Slider
            label={`G: ${rgb.g}`}
            min={0}
            max={255}
            value={rgb.g}
            onChange={(value) => handleRgbChange('g', value)}
          />
          <Slider
            label={`B: ${rgb.b}`}
            min={0}
            max={255}
            value={rgb.b}
            onChange={(value) => handleRgbChange('b', value)}
          />
        </div>
      </div>
    </div>
  );
};
export default AdvancedColorPicker;
