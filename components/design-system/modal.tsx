import React from "react";
import { Typography } from "./typography";
import { Button } from "./button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "small" | "medium" | "large" | "fullscreen";
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    small: "w-1/4",
    medium: "w-1/3",
    large: "w-1/2",
    fullscreen: "w-full h-full",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70">
      <div
        className={`bg-white rounded-lg shadow-lg ${sizeClasses[size]} ${size === "fullscreen" ? "h-full" : ""}`}
      >
        <div className="flex justify-between items-center p-4">
          <Typography variant="h4">{title}</Typography>
        </div>
        <div className="px-4 pb-4 overflow-auto">{children}</div>
        <div className="flex justify-end p-4">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
