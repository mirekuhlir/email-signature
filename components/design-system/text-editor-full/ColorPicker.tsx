import React from "react";

interface ColorPickerProps {
  position: { x: number; y: number };
  onColorSelect: (color: string) => void;
  onClose: () => void;
}

const COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#3b82f6", // blue
  "#6366f1", // indigo
  "#a855f7", // purple
  "#000000", // black
];

export function ColorPicker({
  position,
  onColorSelect,
  onClose,
}: ColorPickerProps) {
  return (
    <div
      className="fixed z-50 bg-white rounded-lg shadow-xl border p-2"
      style={{
        top: `${position.y + 20}px`,
        left: `${position.x}px`,
      }}
    >
      <div className="flex gap-2">
        {COLORS.map((color) => (
          <button
            key={color}
            className="w-6 h-6 rounded-full border hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
            onClick={() => onColorSelect(color)}
          />
        ))}
      </div>
    </div>
  );
}
