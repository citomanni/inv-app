import Image from "next/image";
import React from "react";

const GrowthStrategy = () => {
  return (
    <section
      className="text-white py-16 px-4 md:px-8 lg:px-16 bg-cover bg-no-repeat bg-center"
      style={{
        backgroundColor: "#f2f0ec",
        backgroundImage:
          "url('/footer_bg.webp')",
      }}
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="relative group max-w-5xl mx-auto overflow-hidden rounded-lg shadow-xl hover:scale-[1.02] transition-transform duration-500">
                    <Image
                    width={400}
                    height={400}
                        src="/images/growth-strategy-chart.webp"
                        alt="Cardone Capital Investment Portfolio"
                        className="w-full h-auto"
                    />
                    <a
                        href="/investments"
                        className="absolute inset-0 z-10"
                        aria-label="View Investment Portfolio"
                    ></a>
                    </div>
                

        {/* Text Content */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Real Estate + Bitcoin <br />
            <span className="">A Smarter Growth Strategy</span>
          </h2>
          <p className="text-lg leading-relaxed text-justify mb-6">
            This chart shows a forward-looking comparison between traditional real estate performance and a strategy
            that combines real estate with Bitcoin. Real estate continues to be a proven asset class known for stable
            returns and cash flow.
          </p>
          <a
            href="#"
            className="inline-block bg-[#d93928] hover:bg-[#bf2f20] text-white px-6 py-2 rounded shadow transition"
          >
            Learn More →
          </a>
        </div>
      </div>
    </section>
  );
};

export default GrowthStrategy;
