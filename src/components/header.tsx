/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button } from './ui/button';
import { signOutAction } from '@/app/actions';
import { Container } from './ui/container';
import { useAuthModal } from '@/src/hooks/use-auth-modal';
import { ContextMenu } from './ui/context-menu';
import StyledLink from './ui/styled-link';
import Image from 'next/image';
import logo5_45 from '@/src/asset/logo5_45.png';

const getInitialsFromEmail = (email: string): string => {
  if (!email) return '??';

  const localPart = email.split('@')[0];

  if (localPart.includes('.')) {
    const parts = localPart.split('.');
    if (parts.length >= 2 && parts[0].length > 0 && parts[1].length > 0) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
  }

  return localPart.substring(0, 2).toUpperCase();
};

export const Header = (props: any) => {
  const { user } = props;

  const { showAuthModal } = useAuthModal();

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-lg z-50">
      <Container>
        <div className="mx-auto lg:px-0 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <StyledLink variant="none" href="/">
              <div className="flex items-center">
                <Image src={logo5_45} alt="My Email Avatar" />
                <span className="text-md sm:text-xl font-bold text-brand-blue-900 pl-2">
                  My Email Avatar
                </span>
              </div>
            </StyledLink>
          </div>
          {user ? (
            <div>
              <ContextMenu
                buttonClassName="w-10 h-10 rounded-full bg-linear-to-r from-brand-blue-800 to-brand-blue-900 flex items-center justify-center text-white font-medium cursor-pointer"
                label={getInitialsFromEmail(user.email)}
              >
                <form action={signOutAction}>
                  <div className="pt-2 pb-1 px-2 flex flex-col gap-2 whitespace-nowrap items-start">
                    <StyledLink variant="button-ghost" href="/signatures">
                      My signatures
                    </StyledLink>
                    <StyledLink variant="button-ghost" href="/account">
                      Account
                    </StyledLink>
                    <hr className="w-full border-gray-200" />
                    <Button type="submit" variant="ghost">
                      Sign out
                    </Button>
                  </div>
                </form>
              </ContextMenu>
            </div>
          ) : (
            <Button
              variant="brandBlue"
              onClick={() =>
                showAuthModal({
                  title: 'Sign in',
                  description: 'Please enter your email to sign in.',
                })
              }
            >
              Sign in
            </Button>
          )}
        </div>
      </Container>
    </header>
  );
};
