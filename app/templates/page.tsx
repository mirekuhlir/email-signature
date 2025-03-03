import { Container } from '@/src/components/ui/container';
import { TemplatesExamples } from '@/src/components/templates-examples';

export default async function Examples() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main>
        <div className="pt-16 ">
          <Container>
            <TemplatesExamples isSignedIn={false} />
          </Container>
        </div>
      </main>
    </div>
  );
}
