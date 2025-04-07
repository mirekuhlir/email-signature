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

      {/* Hero Section */}
      <main className="grow w-full pt-16">
        <section className="relative bg-linear-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-24 sm:py-32 overflow-hidden">
          <div className="absolute inset-0 opacity-30"></div>
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-white to-blue-100">
                Create amazing projects
              </h1>
              <p className="text-lg sm:text-xl mb-8 text-blue-100">
                With our tools, you can easily and quickly realize your ideas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <StyledLink size="xl" variant="button-orange" href="/templates">
                  Try for free
                </StyledLink>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-linear-to-br from-purple-600 via-blue-700 to-blue-800 text-white py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjk4IDUwYTQ4IDQ4IDAgMDAwLTk2IDQ4IDQ4IDAgMDAwIDk2em0wIDEwMGE0OCA0OCAwIDEwMC05NiA0OCA0OCAwIDAwMCA5NnptMCAxMDBhNDggNDggMCAxMDAtOTYgNDggNDggMCAwMDAgOTZ6IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-30"></div>
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between relative">
            <div className="mb-8 sm:mb-0">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Join us today
              </h2>
              <p className="text-lg text-blue-100">
                Start your project with us and get a special offer.
              </p>
            </div>
            <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/30 hover:shadow-2xl hover:shadow-blue-900/40 hover:-translate-y-0.5">
              Start now
            </button>
          </div>
        </section>

        {/* New section: Process */}
        <section className="py-24 relative bg-gray-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-purple-500/20 to-transparent"></div>
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative">
            <h2 className="text-3xl sm:text-5xl font-bold text-center mb-16">
              How we work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { title: 'Analysis', bg: 'from-blue-500 to-blue-600' },
                {
                  title: 'Implementation',
                  bg: 'from-purple-500 to-purple-600',
                },
                { title: 'Optimization', bg: 'from-pink-500 to-pink-600' },
              ].map((step, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute inset-0 bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl transform transition-transform group-hover:scale-105"></div>
                  <div
                    className={`relative p-8 border border-gray-700 rounded-2xl overflow-hidden`}
                  >
                    <div
                      className={`w-20 h-20 mb-6 rounded-xl bg-linear-to-r ${step.bg}`}
                    >
                      <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                        {idx + 1}
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-400">
                      Detailed description of the {step.title.toLowerCase()}{' '}
                      phase and what it entails.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* New section: Newsletter with wavy background */}
        <section className="py-24 relative overflow-hidden bg-linear-to-br from-orange-400 to-pink-600">
          <div className="absolute inset-0 bg-repeat-x bg-bottom"></div>
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 shadow-2xl">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  Stay informed
                </h2>
                <p className="text-lg text-white/80 mb-8">
                  Subscribe to our newsletter and be the first to know about our
                  new services and promotions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-6 py-3 rounded-lg bg-white/20 backdrop-blur-lg text-white placeholder-white/60 border border-white/30 focus:outline-hidden focus:ring-2 focus:ring-white/50"
                  />
                  <button className="px-6 py-3 bg-white text-pink-600 rounded-lg font-semibold hover:bg-pink-50 transition-all">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-linear-to-br from-gray-900 to-gray-800 text-gray-300">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              <div>
                <h4 className="text-xl font-semibold text-white mb-4">
                  About us
                </h4>
                <p className="text-gray-400">
                  We are a modern company focused on providing quality services
                  to our customers.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-4">
                  Services
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Consulting
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Development
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Support
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-4">
                  Contact
                </h4>
                <p className="text-gray-400">
                  Email: info@example.com
                  <br />
                  Tel: +420 123 456 789
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-4">
                  Follow us
                </h4>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Facebook
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Twitter
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm sm:text-base text-gray-400">
              <p>© 2024 Your Company. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
