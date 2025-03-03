import React from "react";

interface FormatButtonProps {
  onClick: () => void;
  label: string;
  title?: string;
}

export function FormatButton({ onClick, label, title }: FormatButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition-colors"
      title={title}
    >
      {label}
    </button>
  );
}
