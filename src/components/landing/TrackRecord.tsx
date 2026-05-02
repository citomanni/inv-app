import Image from "next/image";
import React from "react";

const TrackRecord = () => {
  return (
    <section className="bg-[#fffefb] py-16 px-4 md:px-8 lg:px-16 text-gray-800">
      <div className="max-w-7xl mx-auto grid gap-12 items-center">
        {/* Text Content */}
        <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="w-full md:w-[60%]">
          <h2 className="text-4xl font-bold mb-6">TRACK RECORD</h2>
          <p className="text-lg text-center md:text-start leading-relaxed text-gray-800">
            <strong>Cardone Capital</strong> is changing Real Estate combining trophy property with Bitcoin.{" "}
            <strong>Text 404-Bitcoin</strong> for targeted 20% returns. Best in class Real Estate combine with the
            explosive returns of Bitcoin’s potential. What some call “The perfect hedge!” Cardone’s 35 years of
            experience <strong>$5.3 billion</strong> portfolio, massive retail investor reach & flawless track
            record are leading the way in forever changing real estate investing. Many suggest Cardone will disrupt
            traditional syndicators & public and private REITs.
          </p>
          </div>

          {/* Stats Grid */}
          <div className="w-full md:w-[40%] grid grid-cols-2 gap-6 mt-10 text-center md:text-left">
            <div>
              <p className="text-3xl font-bold">$438M</p>
              <p className="text-sm text-gray-600">Investor Distributions</p>
            </div>
            <div>
              <p className="text-3xl font-bold">19,058</p>
              <p className="text-sm text-gray-600">Total Investors</p>
            </div>
            <div>
              <p className="text-3xl font-bold">$1.68B</p>
              <p className="text-sm text-gray-600">Total Funds Raised</p>
            </div>
            <div>
              <p className="text-3xl font-bold">$5.3B</p>
              <p className="text-sm text-gray-600">Total AUM</p>
            </div>
          </div>
        </div>

        <div className="relative bg-[#fffefb] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-10xl mx-auto flex flex-col items-center justify-center space-y-6">
                <div className="relative perspective hover:scale-[1.02] transition-transform duration-500 w-full max-w-5xl">
                <div className="transform-style-3d">
                    <figure className="relative w-full">
                    <Image
                    width={400}
                    height={400}
                        src="/cardone-capital-portfolio-usa.webp"
                        alt="Cardone Capital Investment Portfolio"
                        className="w-full h-auto rounded-md"
                    />
                    <a
                        href="/investments"
                        className="absolute inset-0 z-10"
                        aria-label="View investments"
                    ></a>
                    </figure>
                </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default TrackRecord;
