'use client';
import React from 'react';
import { create } from 'zustand';
import Modal from './modal';
import { Button } from './button';

export type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen';

export interface ModalMessage {
  id: string;
  title?: string;
  content: React.ReactNode;
  size?: ModalSize;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCloseButton?: boolean;
}

// ZUSTAND STORE
interface ModalStore {
  modals: ModalMessage[];
  addModal: (modal: Omit<ModalMessage, 'id'>) => string;
  removeModal: (id: string) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  modals: [],
  addModal: (modal) => {
    const id = Math.random().toString(36).substring(2, 9);

    set((state) => ({
      modals: [...state.modals, { ...modal, id }],
    }));

    return id;
  },
  removeModal: (id) => {
    set((state) => ({
      modals: state.modals.filter((modal) => modal.id !== id),
    }));
  },
}));

// HELPER HOOK
export const useModal = () => {
  const { modals, addModal, removeModal } = useModalStore();

  return {
    modals,
    modal: (props: Omit<ModalMessage, 'id'>) => addModal(props),
    removeModal,
  };
};

export const ModalContainer: React.FC = () => {
  const { modals, removeModal } = useModalStore();

  return (
    <>
      {modals.map((modal: ModalMessage) => (
        <Modal
          key={modal.id}
          isOpen={true}
          title={modal.title}
          size={modal.size || 'medium'}
          onClose={
            modal.showCloseButton !== false
              ? () => removeModal(modal.id)
              : undefined
          }
        >
          <div className="flex flex-col space-y-4">
            <div>{modal.content}</div>

            {(modal.onConfirm || modal.onCancel) && (
              <div className="flex justify-between space-x-2 mt-4">
                {modal.onCancel && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      modal.onCancel?.();
                      removeModal(modal.id);
                    }}
                  >
                    Cancel
                  </Button>
                )}
                {modal.onConfirm && (
                  <Button
                    onClick={() => {
                      modal.onConfirm?.();
                      removeModal(modal.id);
                    }}
                  >
                    Confirm
                  </Button>
                )}
              </div>
            )}
          </div>
        </Modal>
      ))}
    </>
  );
};
