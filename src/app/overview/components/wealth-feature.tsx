import React from 'react';
import { Shield, DollarSign, Receipt, TrendingUp, Banknote, Building } from 'lucide-react';
import Image from 'next/image';

interface WealthFeature {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  image: string;
  isHighlighted?: boolean;
}

const WealthThroughRealEstate: React.FC = () => {
  const features: WealthFeature[] = [
    {
      id: 'stability',
      title: 'Stability',
      description: 'Real estate is less volatile and has historically outperformed the S&P 500.',
      buttonText: 'GAIN STABILITY',
      image: "https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/05/Shield-New.png",
    },
    {
      id: 'tax-benefits',
      title: 'Tax Benefits',
      description: 'Depreciation is a free tax write-off that allows you to keep more cash flow in your pocket.',
      buttonText: 'GET TAX BENEFITS',
      image: "https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/05/Tax-New.png",
    },
    {
      id: 'cash-flow',
      title: 'Cash Flow',
      description: 'Property cash flow services the debt which covers cash flow to the investor.',
      buttonText: 'EARN CASH FLOW',
      image: "https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/05/Cash-Flow-New.png",
    },
    {
      id: 'leverage',
      title: 'Leverage',
      description: 'You can leverage real estate, allowing for the purchase of $100M with only $25M.',
      buttonText: 'LEVERAGE REAL ESTATE',
      image: "https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/05/Leverage-New.png",
    },
    {
      id: 'amortization',
      title: 'Amortization',
      description: 'Property cash flow services the debt which increases your equity, creating long-term wealth.',
      buttonText: 'INCREASE YOUR EQUITY',
      image: "https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/05/Coin-New.png",
    },
    {
      id: 'appreciation',
      title: 'Appreciation',
      description: 'Real estate typically appreciates in value faster than inflation.',
      buttonText: 'GROWING ASSETS',
      image: "https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/05/Appreciation-New.png",
    },
  ];

  return (
      <section className="bg-gray-50 py-16 px-6 lg:px-8 bg-no-repeat bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/source/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/05/bg-4.svg')",
      }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Wealth Through Real Estate
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 mb-12">
          {features.map((feature: any, index) => (
            <div
              key={feature.id}
              className="flex items-start gap-6 hover:scale-105 transition-all duration-400"
            >
              {/* image */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-[#1C2D49] rounded-3xl flex items-center justify-center">
                          <Image
                              src={feature.image}
                              alt={`${feature.title} icon`}
                              width={30}
                              height={30}
                              className="object-contain"
                                priority
                          />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <button className="px-3 py-1.5 bg-[#1C2D49] hidden lg:block text-[#BCD5FF] text-[10px] font-medium rounded-full hover:bg-slate-700 transition-colors duration-200">
                    {feature.buttonText}
                  </button>
                </div>
                
                <p 
                  className={`text-lg leading-relaxed text-[#1C2D49]`}
                >
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-[#1C2D49] text-white px-4 sm:px-8 py-2 sm:mt-12 rounded-full hover:bg-slate-700 transition-colors duration-200 cursor-pointer">
            <span className="sm:text-lg text-[15px] text-nowrap font-medium">Ready to Invest?</span>
            <button className="underline font-medium sm:text-lg text-[15px]">
              Schedule a Call
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WealthThroughRealEstate;