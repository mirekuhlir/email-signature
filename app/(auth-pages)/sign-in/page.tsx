import { Auth } from '@/src/components/auth/auth';
import { Header } from '@/src/components/header';
import { Container } from '@/src/components/ui/container';
import StyledLink from '@/src/components/ui/styled-link';
import { ChevronLeft } from 'lucide-react';

export default async function Signin() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <Header />
      <main>
        <div className="pt-24">
          <Container>
            <div className="flex flex-col gap-2 mt-8 max-w-2xl mx-auto">
              <div className="p-8 bg-white rounded-sm shadow-md">
                <Auth
                  title="Sign in"
                  description="Please enter your email address to sign in."
                />
                <div className="mt-4 mb-2 sm:mb-8 sm:mt-8">
                  <StyledLink
                    variant="default"
                    href="/"
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft size={23} />
                    Back
                  </StyledLink>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </main>
    </div>
  );
}
