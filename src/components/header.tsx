/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button } from './ui/button';
import { Container } from './ui/container';
import { useAuthModal } from '@/src/hooks/use-auth-modal';
import { ContextMenu } from './ui/context-menu';
import StyledLink from './ui/styled-link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/src/utils/supabase/client';

export const signOutClient = async (router: ReturnType<typeof useRouter>) => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Sign out error:', error);
    return { error };
  }

  // Use Next.js router for navigation with refresh
  router.push('/');
  router.refresh();
  return { error: null };
};

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
  const router = useRouter();

  const { showAuthModal } = useAuthModal();

  const handleSignOut = async () => {
    try {
      const result = await signOutClient(router);

      if (result?.error) {
        console.error('Sign out error:', result.error);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-lg z-50">
      <Container>
        <div className="mx-auto lg:px-0 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <StyledLink variant="none" href="/">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-800 via-blue-900 to-brand-blue-900 bg-clip-text text-transparent pl-2 tracking-tight hover:from-blue-700 hover:via-blue-800 hover:to-brand-blue-900 transition-all duration-300 drop-shadow-sm">
                My Email Avatar
              </span>
            </StyledLink>
          </div>
          {user ? (
            <div>
              <ContextMenu
                buttonClassName="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue-800 to-brand-blue-900 hover:from-brand-blue-700 hover:to-brand-blue-800 flex items-center justify-center text-white font-medium cursor-pointer shadow-lg transition-all duration-300"
                label={getInitialsFromEmail(user.email)}
              >
                <div className="pt-2 pb-1 px-2 flex flex-col gap-2 whitespace-nowrap items-start">
                  <StyledLink variant="button-ghost" href="/signatures">
                    My signatures
                  </StyledLink>
                  <StyledLink variant="button-ghost" href="/account">
                    Account
                  </StyledLink>
                  <hr className="w-full border-gray-200" />
                  <Button variant="ghost" onClick={handleSignOut}>
                    Sign out
                  </Button>
                </div>
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
