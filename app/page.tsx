import { createClient } from '@/src/utils/supabase/server';
import { Header } from '@/src/components/header';
import StyledLink from '@/src/components/ui/styled-link';

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <Header user={user} />

      <div className="h-16" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-25">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 mt-12">
            Add personality and credibility to your emails.
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Add a professional signature to your emails and make them stand out
            from the crowd. Most emails lack a good signature, but yours will
            make you stand out.
          </p>
          <StyledLink variant="button-orange" size="2xl" href="/templates">
            Create your own email signature now!
          </StyledLink>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why to have an email signature?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Build Trust
              </h3>
              <p className="text-gray-600">
                A signature with your name and photo makes you look more
                trustworthy.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Show Professionalism
              </h3>
              <p className="text-gray-600">
                A well-designed email signature reflects your attention to
                detail and commitment to quality.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Easy Contact
              </h3>
              <p className="text-gray-600">
                Recipients can reach you quickly with your contact info always
                visible.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Boost Your Brand
              </h3>
              <p className="text-gray-600">
                Your signature is a constant reminder of your brand, helping you
                stay top of mind.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Marketing Benefits
              </h3>
              <p className="text-gray-600">
                Your signature is a great way to promote your services/products,
                share company announcements, and drive traffic to your website.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="get-started" className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to create your email signature?
          </h2>

          <StyledLink variant="button-orange" size="xl" href="/templates">
            Start Creating Now
          </StyledLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 . All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
