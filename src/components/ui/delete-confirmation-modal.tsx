import React from 'react';
import Modal from './modal';
import { Typography } from './typography';
import { Button } from './button';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export const DeleteConfirmationModal: React.FC<
  DeleteConfirmationModalProps
> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
  confirmButtonText = 'Delete',
  cancelButtonText = 'Cancel',
}) => {
  return (
    <Modal size="small" isOpen={isOpen}>
      <div className="p-2">
        <Typography variant="lead">{title}</Typography>
        <Typography variant="body">{message}</Typography>
        <div className="mt-8 flex justify-between">
          <Button variant="outline" disabled={isLoading} onClick={onClose}>
            {cancelButtonText}
          </Button>
          <Button variant="red" loading={isLoading} onClick={onConfirm}>
            {confirmButtonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
