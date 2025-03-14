import React, { useEffect } from 'react';
import { Typography } from './typography';
import { Button } from './button';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'fullscreen';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    small: 'w-full sm:w-[400px]',
    medium: 'w-full sm:w-[600px]',
    large: 'w-full sm:w-[800px]',
    xlarge: 'w-full sm:w-[1000px]',
    fullscreen: 'w-full h-full',
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800/70 bg-opacity-30 z-50">
      <div
        className={`bg-white rounded-lg shadow-lg ${sizeClasses[size]} ${size === 'fullscreen' ? 'h-full' : ''}`}
      >
        {title && (
          <div className="flex justify-between items-center p-4">
            <Typography variant="h4">{title}</Typography>
          </div>
        )}
        <div className="px-4 pb-4 overflow-auto max-h-[80vh]">{children}</div>
        {onClose && (
          <div className="flex justify-end p-4">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
