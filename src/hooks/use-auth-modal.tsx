'use client';
import { useModal } from '@/src/components/ui/modal-system';
import { Auth } from '@/src/components/auth/auth';

export const useAuthModal = () => {
  const { modal } = useModal();

  const showAuthModal = ({
    title,
    description,
  }: {
    title?: string;
    description?: string;
  }) => {
    return modal({
      content: <Auth title={title} description={description} />,
      size: 'small',
    });
  };

  return { showAuthModal };
};
