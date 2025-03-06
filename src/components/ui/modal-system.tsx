'use client';
import React from 'react';
import { create } from 'zustand';
import Modal from './modal';

// TYPES
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

// MODAL CONTAINER COMPONENT
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
              <div className="flex justify-end space-x-2 mt-4">
                {modal.onCancel && (
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    onClick={() => {
                      modal.onCancel?.();
                      removeModal(modal.id);
                    }}
                  >
                    Cancel
                  </button>
                )}
                {modal.onConfirm && (
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => {
                      modal.onConfirm?.();
                      removeModal(modal.id);
                    }}
                  >
                    Confirm
                  </button>
                )}
              </div>
            )}
          </div>
        </Modal>
      ))}
    </>
  );
};
