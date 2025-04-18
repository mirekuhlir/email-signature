import React, { useEffect } from 'react';
import { Typography } from './typography';
import { Button } from './button';
import { Container } from './container';
import { Hr } from './hr';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'fullscreen';
  isZeroPadding?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  isZeroPadding = false,
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
        className={`bg-white rounded-lg shadow-lg ${sizeClasses[size]} ${size === 'fullscreen' ? 'h-full flex flex-col' : ''}`}
      >
        {title && (
          <div className="flex justify-between items-center p-4 border-b">
            <Typography variant="h4">{title}</Typography>
          </div>
        )}
        <div
          className={`overflow-auto ${size === 'fullscreen' ? 'flex-grow' : 'max-h-[80vh]'} ${isZeroPadding ? 'p-0' : 'p-4'}`}
        >
          {children}
        </div>
        <></>
        {onClose && size !== 'fullscreen' && (
          <>
            <Hr />
            <div className="flex justify-end p-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </>
        )}
        {onClose && size === 'fullscreen' && (
          <Container isZeroPadding={true}>
            <>
              <Hr />
              <div className="flex justify-end p-4">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </>
          </Container>
        )}
      </div>
    </div>
  );
};

export default Modal;
