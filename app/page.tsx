import { createClient } from '@/src/utils/supabase/server';
import { Header } from '@/src/components/header';
import StyledLink from '@/src/components/ui/styled-link';

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header user={user} />
      <div className="h-10" />

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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 mt-8">
            Create a professional email signature in 2 minutes
          </h1>
          <p className="text-lg md:text-xl mb-4">
            Get more replies to your emails with a trustworthy and attractive
            signature. Free and no registration required.
          </p>
          <img
            src="/images/ukazka-podpisu.png"
            alt="Sample email signature"
            className="mx-auto mb-6 rounded shadow-lg max-w-md"
          />
          <StyledLink variant="button-orange" size="2xl" href="/templates">
            Start for free
          </StyledLink>
          <p className="mt-4 text-sm opacity-80">
            No hidden fees. Your signature is yours forever.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why have an email signature?
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <li className="text-center">
              <div className="mb-4 text-4xl">🤝</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Trustworthiness
              </h3>
              <p className="text-gray-600">
                A signature with a photo and name increases the recipient&apos;s
                trust.
              </p>
            </li>
            <li className="text-center">
              <div className="mb-4 text-4xl">💼</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Professional appearance
              </h3>
              <p className="text-gray-600">
                Your email looks representative and sets you apart from others.
              </p>
            </li>
            <li className="text-center">
              <div className="mb-4 text-4xl">📈</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Brand support
              </h3>
              <p className="text-gray-600">
                Every email strengthens awareness of your brand or company.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            How does it work?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-4 text-4xl">1️⃣</div>
              <h3 className="text-lg font-semibold mb-2">Choose a template</h3>
              <p className="text-gray-600">
                Select from professionally designed signature templates.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl">2️⃣</div>
              <h3 className="text-lg font-semibold mb-2">
                Customize your signature
              </h3>
              <p className="text-gray-600">
                Add your details, photo, and company logo.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl">3️⃣</div>
              <h3 className="text-lg font-semibold mb-2">Copy & paste</h3>
              <p className="text-gray-600">
                Copy your signature to your email with one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section - User Quotes */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            What our users say
          </h2>
          <div className="space-y-6">
            <blockquote className="italic text-gray-700">
              &quot;Thanks to the signature from this site, I look much more
              professional in emails. I recommend it!&quot;
              <br />
              <span className="font-semibold">— Jana, HR specialist</span>
            </blockquote>
            <blockquote className="italic text-gray-700">
              &quot;Simple, fast, free. Exactly what I needed.&quot;
              <br />
              <span className="font-semibold">— Petr, freelancer</span>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Trusted by users from companies like
          </h2>
          <div className="flex flex-wrap justify-center gap-8 mb-6">
            <div className="text-3xl">🚀</div>
            <div className="text-3xl">🏢</div>
            <div className="text-3xl">👩‍💻</div>
            <div className="text-3xl">🧑‍💼</div>
          </div>
          <p className="text-gray-600">
            Over 10,000 users have already created their signature.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section id="get-started" className="bg-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Start with your own email signature today
          </h2>
          <StyledLink variant="button-orange" size="xl" href="/templates">
            Create signature for free
          </StyledLink>
          <p className="mt-4 text-sm opacity-80">
            No hidden fees. Your signature is yours forever.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700">
                Is the service really free?
              </h3>
              <p className="text-gray-600">
                Yes, the basic features are completely free with no hidden fees.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">
                Can I use the signature in Gmail, Outlook, or Seznam?
              </h3>
              <p className="text-gray-600">
                Yes, the signature can be used in all common email clients.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">
                Do I have to register?
              </h3>
              <p className="text-gray-600">
                No, you can create a signature without registration. For saving
                and managing multiple signatures, we recommend registering.
              </p>
            </div>
          </div>
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
