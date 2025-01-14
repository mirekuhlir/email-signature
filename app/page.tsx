import { createClient } from "@/utils/supabase/server";
import { useTranslation } from "./i18n";
import { Header } from "@/components/header/header";

export default async function Home() {
  const { t } = await useTranslation();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header user={user} />

      {/* Hero Section */}
      <main className="flex-grow w-full pt-16">
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-24 sm:py-32 overflow-hidden">
          <div className="absolute inset-0 opacity-30"></div>
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative">
            <div className="max-w-2xl">
              {t("title")}
              <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                Create amazing projects
              </h1>
              <p className="text-lg sm:text-xl mb-8 text-blue-100">
                With our tools, you can easily and quickly realize your ideas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/30 hover:shadow-2xl hover:shadow-blue-900/40 hover:-translate-y-0.5">
                  Start for free
                </button>
                <button className="px-8 py-4 bg-transparent border-2 border-white/50 text-white rounded-lg font-semibold hover:border-white hover:bg-white/10 transition-all">
                  More information
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white relative">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white"></div>
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative">
            <h2 className="text-3xl sm:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Why choose our services?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Quality",
                  gradient: "from-yellow-400 to-orange-500",
                },
                {
                  title: "Security",
                  gradient: "from-green-400 to-emerald-600",
                },
                {
                  title: "Speed",
                  gradient: "from-purple-400 to-purple-600",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="group p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl transition-opacity opacity-0 group-hover:opacity-100"></div>
                  <div className="relative">
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6`}
                    ></div>
                    <h3 className="text-2xl font-semibold mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
              {[
                {
                  number: "10k+",
                  text: "Satisfied customers",
                  gradient: "from-blue-600 to-blue-800",
                },
                {
                  number: "99.9%",
                  text: "Service availability",
                  gradient: "from-purple-600 to-blue-600",
                },
                {
                  number: "24/7",
                  text: "Customer support",
                  gradient: "from-blue-600 to-purple-600",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="text-center bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
                >
                  <div
                    className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-4`}
                  >
                    {stat.number}
                  </div>
                  <div className="text-gray-600 text-lg">{stat.text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-white py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50"></div>
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative">
            <h2 className="text-3xl sm:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              What our clients say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="group p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative border border-gray-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <p className="text-gray-600 mb-6 text-lg">
                      "Great services, professional approach. I can only
                      recommend!"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                      <div>
                        <div className="font-semibold text-lg">Jan Novák</div>
                        <div className="text-gray-500">
                          CEO, Technology s.r.o.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-gradient-to-br from-purple-600 via-blue-700 to-blue-800 text-white py-24 relative overflow-hidden">
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

        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50"></div>
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative">
            <h2 className="text-3xl sm:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Our story
            </h2>
            <div className="space-y-12">
              {[
                {
                  year: "2020",
                  title: "Founding of the company",
                  description: "We started with a vision to change the world.",
                },
                {
                  year: "2021",
                  title: "First successes",
                  description: "We have achieved significant milestones.",
                },
                {
                  year: "2022",
                  title: "International expansion",
                  description: "We have expanded our operations abroad.",
                },
                {
                  year: "2023",
                  title: "Innovation and growth",
                  description: "We have introduced revolutionary solutions.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row gap-8 items-center group"
                >
                  <div className="w-full md:w-1/4 p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all group-hover:-translate-y-1">
                    <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {item.year}
                    </div>
                  </div>
                  <div className="w-full md:w-3/4 p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all group-hover:-translate-y-1">
                    <h3 className="text-2xl font-semibold mb-4">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* New section: Services with diagonal split */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 transform -skew-y-6 scale-110"></div>
          <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-5xl font-bold text-center mb-16 text-white">
              Our Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                "Strategic consulting",
                "Digital transformation",
                "Cloud solutions",
                "Data analytics",
              ].map((service, idx) => (
                <div
                  key={idx}
                  className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
                >
                  <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {service}
                  </h3>
                  <p className="text-gray-600">
                    We provide professional solutions tailored to your needs.
                  </p>
                </div>
              ))}
            </div>
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
                { title: "Analysis", bg: "from-blue-500 to-blue-600" },
                {
                  title: "Implementation",
                  bg: "from-purple-500 to-purple-600",
                },
                { title: "Optimization", bg: "from-pink-500 to-pink-600" },
              ].map((step, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl transform transition-transform group-hover:scale-105"></div>
                  <div
                    className={`relative p-8 border border-gray-700 rounded-2xl overflow-hidden`}
                  >
                    <div
                      className={`w-20 h-20 mb-6 rounded-xl bg-gradient-to-r ${step.bg}`}
                    >
                      <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                        {idx + 1}
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-400">
                      Detailed description of the {step.title.toLowerCase()}{" "}
                      phase and what it entails.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* New section: Newsletter with wavy background */}
        <section className="py-24 relative overflow-hidden bg-gradient-to-br from-orange-400 to-pink-600">
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
                    className="flex-1 px-6 py-3 rounded-lg bg-white/20 backdrop-blur-lg text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
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
        <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300">
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
