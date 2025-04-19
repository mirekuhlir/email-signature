import { Header } from '@/src/components/header';
import { Container } from '@/src/components/ui/container';
import StyledLink from '@/src/components/ui/styled-link';
import { ChevronLeft } from 'lucide-react';

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <Header />
      <main className="pt-24">
        <Container>
          <div className="flex flex-col gap-2 mt-8 max-w-2xl mx-auto">
            <div className="p-8 bg-white rounded-sm shadow-md">
              <h1 className="text-4xl font-bold mb-4">Error</h1>
              <p className="text-lg mb-8 text-center">
                An unexpected error occurred. Please try again later.
              </p>
              <div className="flex flex-col gap-4 items-center">
                <StyledLink
                  variant="button-blue"
                  href="/sign-in"
                  className="inline-flex justify-center items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Sign In
                </StyledLink>
                <StyledLink
                  variant="default"
                  href="/"
                  className="flex items-center gap-1 justify-center"
                >
                  <ChevronLeft size={23} />
                  Back to Home
                </StyledLink>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
