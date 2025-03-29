'use client';
import { useModal } from '@/src/components/ui/modal-system';
import { Auth } from '@/src/components/auth/auth';

export const useAuthModal = () => {
  const { modal } = useModal();

  const showAuthModal = (text: string = 'Sign in to access your account') => {
    return modal({
      content: <Auth text={text} />,
      size: 'medium',
    });
  };

  return { showAuthModal };
};
