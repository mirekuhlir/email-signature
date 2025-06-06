import { createClient } from '@/src/utils/supabase/server';
import { Header } from '@/src/components/header';
import StyledLink from '@/src/components/ui/styled-link';
import { EmailTemplateView } from '@/src/components/signature-detail/content-view/signature-view';
import { signature_a } from '@/src/templates/signature_a';
import { signature_d } from '@/src/templates/signature_d';
import { signature_i } from '@/src/templates/signature_i';
import { Handshake, ChartLine, Award } from 'lucide-react';

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      <div className="h-5" />

      {/* Hero Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-6 mt-12 text-brand-blue-900">
            Create a professional
            <span className="text-orange-600"> email signature</span> in{' '}
            <span className="text-orange-600">just minutes</span>
          </h1>
          <p className="text-lg md:text-xl mx-auto mb-8 text-brand-purple-900">
            Make your emails trustworthy and attractive.
          </p>
          <StyledLink variant="button-orange" size="xl" href="/templates">
            Create your signature now!
          </StyledLink>
        </div>
      </section>

      {/* Examples of email signatures Section */}
      <section className="py-10 bg-white pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-brand-blue-900 mb-6">
              Choose from our professional templates
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-16 justify-center items-center sm:items-end">
            <EmailTemplateView rows={signature_i().rows} />
            <EmailTemplateView rows={signature_a().rows} />
            <EmailTemplateView rows={signature_d().rows} />
          </div>
          <p className="text-lg md:text-xl mx-auto mb-8 text-brand-purple-900 text-center mt-12">
            You can customize your signature to match your style - change
            colors, fonts and anything else you want.
          </p>
          <div className="flex mt-6 justify-center">
            <StyledLink variant="button-brand-blue" size="xl" href="/templates">
              {'See all templates'}
            </StyledLink>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-brand-blue-900 mb-12">
            Why have an email signature?
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <li className="text-center">
              <div className="mb-4 text-4xl text-brand-blue-900 flex justify-center items-center">
                <Handshake className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Trustworthiness
              </h3>
              <p className="text-gray-600">
                A signature with a photo and name increases the recipient&apos;s
                trust.
              </p>
            </li>
            <li className="text-center">
              <div className="mb-4 text-4xl text-brand-blue-900 flex justify-center items-center">
                <Award className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Professional appearance
              </h3>
              <p className="text-gray-600">
                Your email looks representative and sets you apart from others.
              </p>
            </li>
            <li className="text-center">
              <div className="mb-4 text-4xl text-brand-blue-900 flex justify-center items-center">
                <ChartLine className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Brand support
              </h3>
              <p className="text-gray-600">
                Every email strengthens your brand and helps you make new
                connections.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-brand-blue-900 mb-12">
            How does it work?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-4 text-3xl font-bold text-brand-blue-900">
                1.
              </div>
              <h3 className="text-lg font-semibold mb-2">Choose a template</h3>
              <p className="text-gray-600">
                Select from professionally designed signature templates.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-3xl font-bold text-brand-blue-900">
                2.
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Customize your signature
              </h3>
              <p className="text-gray-600">
                Add your details, photo or company logo.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-3xl font-bold text-brand-blue-900">
                3.
              </div>
              <h3 className="text-lg font-semibold mb-2">Copy & paste</h3>
              <p className="text-gray-600">
                Copy your signature to your email with one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section - User Quotes */}
      {/*       <section className="py-14 bg-white">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-brand-blue-900 mb-6">
            What our users say
          </h2>
          <div className="space-y-6">
            <blockquote className="italic text-gray-700">
              &quot;Thanks to the signature from this site, I look much more
              professional in emails. I recommend it!&quot;
              <br />
              <span className="font-semibold">— Jane, HR specialist</span>
            </blockquote>
            <blockquote className="italic text-gray-700">
              &quot;Simple and fast. Exactly what I needed.&quot;
              <br />
              <span className="font-semibold">— Peter, freelancer</span>
            </blockquote>
          </div>
        </div>
      </section> */}

      {/* Social Proof Section */}
      {/*      <section className="py-14 bg-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-brand-blue-900 mb-6">
            Trusted by users from companies like
          </h2>
          <div className="flex flex-wrap justify-center gap-8 mb-6">
            <div className="text-3xl">🚀</div>
            <div className="text-3xl">🏢</div>
            <div className="text-3xl">👩‍💻</div>
            <div className="text-3xl">🧑‍💼</div>
          </div>
          <p className="text-gray-600">
            Over 1000 users have already created their signature.
          </p>
        </div>
      </section> */}

      {/* FAQ Section */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-blue-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700">
                Can I use the signature in Gmail or Outlook?
              </h3>
              <p className="text-gray-600">
                Yes, the signature can be used in all common email clients.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">
                Do I have to pay a recurring fee?
              </h3>
              <p className="text-gray-600">
                No, you pay only once and can use your signatures forever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="get-started" className="py-14 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-brand-blue-900">
            Start with your own email signature today
          </h2>
          <StyledLink variant="button-orange" size="xl" href="/templates">
            Create signature
          </StyledLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
