import { Container } from '@/components/ui/container';
import { TemplatesExamples } from '@/components/templates-examples';

export default async function Examples() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main>
        <div className="pt-16 ">
          <Container>
            <TemplatesExamples />
          </Container>
        </div>
      </main>
    </div>
  );
}
