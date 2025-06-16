import { Typography } from '../ui/typography';

const PricingCard = () => {
  return (
    <div className="mx-auto">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-blue-900 mb-6">
          Simple, Transparent Pricing
        </h2>
        <Typography className="text-xl text-gray-600 mx-auto">
          Get lifetime access to all professional email signatures with a single
          payment
        </Typography>
      </div>

      {/* Pricing Card */}
      <div className="max-w-md mx-auto">
        <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-8 pt-12">
            {/* Price */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-2">
                <span className="text-5xl font-bold text-gray-900">$30</span>
                <span className="text-gray-500 ml-2">USD</span>
              </div>
              <Typography className="text-gray-600">
                One-time payment
              </Typography>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <Typography className="text-gray-700">
                  Lifetime access to all signatures
                </Typography>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <Typography className="text-gray-700">
                  No recurring fees
                </Typography>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <Typography className="text-gray-700">
                  No hidden charges
                </Typography>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <Typography className="text-gray-700">
                  Professional email signatures
                </Typography>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <Typography className="text-gray-700">
                  One-time payment
                </Typography>
              </div>
            </div>

            {/* CTA Button */}
            <button className="w-full bg-gradient-to-r bg-brand-blue-900 hover:from-brand-blue-900 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
              Get Lifetime Access
            </button>

            {/* Security Badge */}
            <div className="flex items-center justify-center mt-6 text-sm text-gray-500">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Secure payment via TODO:
            </div>
          </div>
        </div>
      </div>

      {/*         <div className="text-center mt-12">
    <Typography className="text-gray-600 mb-4">
      Join thousands of professionals who trust our email signatures
    </Typography>
    <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
      <div className="flex items-center">
        <svg
          className="w-4 h-4 mr-1"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        30-day money back guarantee
      </div>
      <div className="flex items-center">
        <svg
          className="w-4 h-4 mr-1"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        24/7 support
      </div>
    </div>
  </div> */}
    </div>
  );
};

export default PricingCard;
