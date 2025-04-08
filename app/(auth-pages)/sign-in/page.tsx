import { Auth } from '@/src/components/auth/auth';
import { Header } from '@/src/components/header';
import { Container } from '@/src/components/ui/container';

export default async function Signin() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <Header />
      <main>
        <div className="pt-24">
          <Container>
            <div className="flex flex-col gap-2 mt-8 max-w-2xl mx-auto">
              <Auth text="Please enter your e-mail address to sign in" />
            </div>
          </Container>
        </div>
      </main>
    </div>
  );
}
