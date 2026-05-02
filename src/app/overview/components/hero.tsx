import Image from "next/image";
import InfiniteImageCarousel from "./image-carousel";
const Hero = () => {
  return (
    <div className="bg-[#fffefb] py-10 lg:py-16  px-4 xl:px-0">
      <div className="max-w-6xl mx-auto">
        {/* About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start lg:mb-20">
          {/* Left Content */}
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-8">
              About Cardone Capital
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Cardone Capital acquires and manages real estate properties with a
              focus on both near-term income generation and long-term value
              creation. Grant Cardone, Founder and CEO, created Cardone Capital
              to provide everyday investors access to the institutional-grade
              real estate deals that are normally reserved for only the largest
              investors.
            </p>

            {/* Property Images Grid */}
            <InfiniteImageCarousel
              images={[
                "https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/06/carousel_assets05.jpg",
                "https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/06/carousel_assets02.jpg",
                "https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/06/carousel_assets04.jpg",
                "https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/06/carousel_assets03.jpg",
                "https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/06/carousel_assets01.jpg",
                "https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/06/carousel_assets07.jpg",
                "https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/06/carousel_assets06.jpg",
                "https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/06/carousel_assets08.jpg",
              ]}
              speed={60} // pixels per second
            />

            <div>
              <div className="mt-12 grid grid-cols-2 gap-0 sm:gap-8">
                {/* Investor Distributions */}
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                    $438M
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Investor Distributions
                  </div>
                </div>

                {/* Total Investors */}
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                    19,058
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Total Investors
                  </div>
                </div>

                {/* Total Funds Raised */}
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                    $1.72B
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Total Funds Raised
                  </div>
                </div>

                {/* Total AUM */}
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                    $5.3B
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Total AUM
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-12">
                <button className="bg-red-700 hover:bg-red-800 text-white font-semibold px-8 py-3 rounded-[4px] transition-colors duration-200">
                  Invest Now
                </button>
              </div>
            </div>
          </div>

          {/* Right Image with Since Badge */}
          <div className="flex lg:flex-col -mt-9 sm:mt-0 lg:gap-0 gap-12 flex-col-reverse">
            <div className="relative">
              <div className="h-60 sm:h-96 lg:h-[350px] overflow-hidden">
                <Image
                  src="https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/07/29-10XCENTRE-cardone-capital.jpg"
                  alt="Miami skyline with modern buildings"
                  fill
                  className="object-cover"
                />
                {/* Since 2016 Badge */}
                <div className="absolute right-3 -bottom-7 lg:top-[260px] lg:right-6 bg-[#172E4E] text-white tracking-widest sm:w-32 px-4 py-4 sm:py-6">
                  <div className="text-sm font-medium mb-1">SINCE</div>
                  <div className="text-3xl sm:text-4xl font-bold">2016</div>
                </div>
              </div>
            </div>
            {/* Track Record Section */}
            <div className="mt-12">
              <h2 className="text-2xl text-center sm:text-left lg:text-4xl font-bold text-gray-900 mb-6">
                TRACK RECORD
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Cardone Capital is changing Real Estate combining trophy
                  property with Bitcoin.{" "}
                  <span className="font-semibold">Text 404-Bitcoin</span> for
                  targeted 20% returns. Best in class Real Estate combine with
                  the explosive returns of Bitcoin's potential. What some call
                  "The perfect hedge" Cardone's 35 years of experience{" "}
                  <span className="font-semibold">$5.3 billion</span> portfolio,
                  massive retail investor reach & flawless track record are
                  leading the way in forever changing real estate investing.
                  Many suggest Cardone will disrupt traditional syndicators &
                  public and private REITs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
