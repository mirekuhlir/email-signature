/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button } from '@/src/components/ui/button';
import { signOutAction } from '@/app/actions';
import { Container } from './ui/container';
import { useModal } from './ui/modal-system';
import { Auth } from './auth/auth';

export const Header = (props: any) => {
  const { user } = props;

  const { modal } = useModal();

  const showAuthModal = () => {
    modal({
      content: <Auth />,
      size: 'small',
    });
  };

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-lg z-50">
      <Container>
        <div className="mx-auto px-4 sm:px-6 lg:px-0 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Logo
            </span>
          </div>
          {user ? (
            <div>
              <div> {user.email}</div>

              <form action={signOutAction}>
                <Button type="submit" variant={'outline'}>
                  Sign out
                </Button>
              </form>
            </div>
          ) : (
            <Button onClick={showAuthModal}>Sign in</Button>
          )}
        </div>
      </Container>
    </header>
  );
};
