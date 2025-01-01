import React from "react";

interface FontSizeSelectProps {
  onChange: (size: string) => void;
}

const FONT_SIZES = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
];

export function FontSizeSelect({ onChange }: FontSizeSelectProps) {
  return (
    <select
      onChange={(e) => onChange(e.target.value)}
      className="px-2 py-1.5 border rounded text-sm"
    >
      {FONT_SIZES.map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </select>
  );
}
