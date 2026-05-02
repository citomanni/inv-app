import React from 'react';

const Hero = () => {
  return (
    <section className="relative min-h-[450px] md:min-h-[850px] flex text-white">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="https://cardonecapital.com/wp-content/uploads/2025/07/4K_10XBOCAMIZNER_01-bg-2.jpg"
          className="w-full h-full object-cover"
        >
          <source
          src="https://cardonecapital.com/wp-content/uploads/2025/07/NEW-VIDEO-WEBSITE-INTRO-BOCA-RATON-Header_option_2.mp4"
          type="video/mp4"
        />
        </video>
      </div>

      {/* <div className="md:mt-10 md:ml-80 bg-gray-300 relative z-10 max-w-6xl px-6 py-12"> */}
      <div className="mx-auto items-center relative z-10 max-w-6xl w-full px-6 py-12">
        <h1 className="md:mt-[7.5rem] text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-md">
          Institutional Quality<br />
          Real Estate Paired With Bitcoin
        </h1>

        {/* Buttons */}
        <div className="mt-8 flex md:flex-row items-center gap-4">
          <a
            href="#"
            className="bg-[#d93928] hover:bg-[#bf2f20] text-white px-6 py-2 rounded shadow transition"
          >
            Get the PPM →
          </a>
          <a
            href="#"
            className="bg-[#1f2d3d] hover:bg-[#15202b] text-white px-6 py-2 rounded shadow transition"
          >
            Invest Now →
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
