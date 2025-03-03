import React, { useState, useRef, useEffect } from "react";
import { Button } from "./button";

interface MenuItem {
  label: string;
  onClick: () => void;
}

interface ContextMenuProps {
  label?: string;
  items?: MenuItem[];
  placement?: "left" | "right";
  children?: React.ReactNode;
  el?: React.ElementType;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  label,
  items,
  placement = "left",
  children,
  el,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [direction, setDirection] = useState<"down" | "up">("down");

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 100) {
        setDirection("up");
      } else {
        setDirection("down");
      }
    }
  }, [isOpen]);

  const MenuContainer: React.ElementType = el || "div";

  const menuStyle: React.CSSProperties = {
    ...(direction === "up"
      ? { bottom: "100%", marginBottom: "0.25rem" }
      : { top: "100%", marginTop: "0.25rem" }),
    ...(placement === "left" ? { right: 0 } : { left: 0 }),
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <Button
        size="sm"
        variant="outline"
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
      >
        {label ? label : "•••"}
      </Button>

      {isOpen && (
        <MenuContainer
          className="absolute z-10 w-48 rounded shadow-lg bg-white border border-gray-200"
          style={menuStyle}
        >
          <div className="py-1">
            {children
              ? children
              : items &&
                items.map((item, index) => (
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
        </MenuContainer>
      )}
    </div>
  );
};
