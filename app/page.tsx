import { createClient } from '@/src/utils/supabase/server';
import { Header } from '@/src/components/header';
import StyledLink from '@/src/components/ui/styled-link';
import { EmailTemplateView } from '@/src/components/signature-detail/content-view/signature-view';
import { signature_a } from '@/src/templates/signature_a';
import { signature_d } from '@/src/templates/signature_d';
import { signature_i } from '@/src/templates/signature_i';
import {
  Handshake,
  ChartLine,
  Award,
  Sparkles,
  CreditCard,
} from 'lucide-react';
import { getUserStatus, UserStatus } from '@/src/utils/userState';
import PricingCard from '@/src/components/pricing/pricing-card';
import gmail from '@/src/asset/email-clients/gmail.png';
import outlook from '@/src/asset/email-clients/outlook.png';
import ios from '@/src/asset/email-clients/ios.png';
import Image from 'next/image';

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userStatus = getUserStatus(user);

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
          {(userStatus === UserStatus.NOT_LOGGED_IN ||
            userStatus === UserStatus.PREMIUM) && (
            <StyledLink variant="button-orange" size="xl" href="/signatures">
              Create your signature now!
            </StyledLink>
          )}

          {/*   TODO: odkaz přímo na stripe */}
          {userStatus === UserStatus.TRIAL && (
            <StyledLink
              variant="button-orange"
              size="xl"
              href="/pricing"
              className="min-w-50"
            >
              Buy
            </StyledLink>
          )}
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
            <StyledLink
              variant="button-brand-blue"
              size="xl"
              href="/signatures"
            >
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
                <Handshake className="w-10 h-10 text-orange-500" />
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
                <Award className="w-10 h-10 text-orange-500" />
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
                <ChartLine className="w-10 h-10 text-orange-500" />
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
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-brand-blue-900 mb-12">
            How does it work?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-orange-500 flex justify-center items-center">
                1.
              </div>
              <h3 className="text-lg font-semibold mb-2">Choose a template</h3>
              <p className="text-gray-600">
                Select from professionally designed signature templates.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-orange-500">2.</div>
              <h3 className="text-lg font-semibold mb-2">
                Customize your signature
              </h3>
              <p className="text-gray-600">
                Add your details, photo or company logo.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-orange-500">3.</div>
              <h3 className="text-lg font-semibold mb-2">Copy & paste</h3>
              <p className="text-gray-600">
                Copy your signature to your email.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Email Clients Section */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-brand-blue-900 mb-6">
            Compatible with all major email clients
          </h2>
          <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Your signature will work perfectly in all popular email clients
          </p>

          <div className="flex flex-col sm:flex-row gap-12 sm:gap-16 max-w-3xl mx-auto justify-center items-center">
            <div className="flex flex-row gap-2">
              <div>
                <Image
                  src={gmail}
                  alt="Gmail"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div className="flex justify-center items-center">
                <h3 className="text-lg font-semibold text-gray-800">Gmail</h3>
              </div>
            </div>

            <div className="flex flex-row gap-2">
              <div>
                <Image
                  src={outlook}
                  alt="Outlook"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div className="flex justify-center items-center">
                <h3 className="text-lg font-semibold text-gray-800">Outlook</h3>
              </div>
            </div>

            <div className="flex flex-row gap-2">
              <div>
                <Image
                  src={ios}
                  alt="Apple Mail & iPhone & iPad"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div className="flex justify-center items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Apple Mail
                </h3>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              And many more email clients including Thunderbird, Yahoo Mail, and
              others
            </p>
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

      <section className="py-14 bg-white">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-blue-900 mb-6">
            Try all features for free
          </h2>

          <div className="flex flex-col justify-center">
            <div className="grid grid-cols-1 gap-y-8 text-left max-w-2xl mx-auto">
              <div className="flex items-start space-x-4">
                <div>
                  <Sparkles className="w-10 h-10 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">
                    Full Access to Premium Features
                  </h3>
                  <p className="text-gray-600">
                    {`Explore everything our platform has to offer for free.`}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div>
                  <CreditCard className="w-10 h-10 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">
                    No Credit Card Required
                  </h3>
                  <p className="text-gray-600">
                    We don&apos;t ask for any payment information upfront.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <StyledLink variant="button-orange" size="xl" href="/signatures">
              Try for free
            </StyledLink>
          </div>
        </div>
      </section>

      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <PricingCard />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-14 py-14 bg-white">
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
                Yes, the signature can be used in all email clients.
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
      {/*       <section id="get-started" className="py-14 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-brand-blue-900">
            Start with your own email signature today
          </h2>
          <StyledLink variant="button-orange" size="xl" href="/templates">
            Create signature
          </StyledLink>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
