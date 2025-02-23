import React, { useState, useRef, useEffect } from "react";

interface ContextMenuProps {
  label?: string;
  items: {
    label: string;
    onClick: () => void;
  }[];
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Zavření menu při kliknutí mimo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded bg-white hover:bg-gray-50 border border-gray-200 focus:outline-none"
      >
        {label ? label : <span className="text-gray-600">•••</span>}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-48 rounded shadow-lg bg-white border border-gray-200">
          <div className="py-1">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
