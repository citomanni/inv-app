import React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

const CeoMessage = () => {
  return (
    <section
      className="bg-[#1a1e29] text-white px-6 pt-12 text-sm bg-cover bg-no-repeat bg-center"
      style={{
        backgroundColor: "#1c2d49",
        backgroundImage:
          "url('https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-aca49c2/cardonecapital.com/wp-content/uploads/2025/05/footer_cc.jpg')",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Content */}
          <div className="text-white space-y-3 max-w-lg">
            <div>
              <p className="text-sm md:text-xl font-medium tracking-widest uppercase mb-4">
                FOUNDER & CEO
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-8">
                A Message From Grant Cardone
              </h1>
            </div>

            <div className="space-y-3 text-base md:text-lg leading-relaxed text-gray-200">
              <p>
                I stand for leveling the playing field and will use my example
                and influence to advance those who have been misinformed and
                marginalized. I provide opportunities that are actionable.
              </p>

              <p>
                For the last 35 years, I have acquired real estate for myself
                and my family. Real estate investing has allowed me to live a
                lifestyle I never imagined. I created Cardone Capital so
                everyone has the same opportunity!
              </p>
            </div>

            {/* Signature */}
            <div className="relative py-4 w-36 h-20">
                          <Image
                              src={"https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/06/34D2D8A9-B43F-47C7-B6F6-39B28E165E37-198x300.png"}
                              alt={"signature of Ceo"} 
                              fill
                              className="object-contain"
                              priority
                          />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col py-8 sm:flex-row gap-4">
              <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-2  rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center group">
                <span className="mr-1">Invest Today</span>
                <ChevronRight size={19} />
              </button>

              <button className="border-2 border-white text-black bg-white hover:text-slate-900 font-semibold px-8 py-2 rounded-lg hover:scale-105 transition-all duration-200 flex items-center justify-center group">
                <span>Schedule a Call</span>
                <ChevronRight size={19} />
              </button>
            </div>
          </div>

          {/* Right Image with Blue Brush Effect */}
          <div className="relative flex justify-center lg:justify-start">
            <div className="relative z-10 w-72 h-[440px] lg:w-96 lg:h-[630px]">
              <Image
                src="https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/06/Grant-Message-2-1.png"
                alt="Grant Cardone - Founder & CEO"
                fill
                className="object-cover object-center rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional decorative elements */}
    </section>
  );
};

export default CeoMessage;
