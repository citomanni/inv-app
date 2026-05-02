"use client";
import Image from "next/image";
import { useRef, useState } from "react";

const FeaturedLogosCarousel = () => {
  const mediaLogos = [
    { name: "Enterpreneur", src: "https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/05/entrepreneur.png" },
    { name: "Forbes", src: "https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/05/forbes.png" },
    { name: "Fox Bussiness", src: "https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/05/fox-bz.png" },
    { name: "Fox News", src: "https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/05/fox-news.png" },
    { name: "MSNBC", src: "https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/05/msnbc.png" },
    { name: "Bigger Pockets", src: "https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/05/Bigger-Pockets.png" },
    { name: "Bloomberg", src: "https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/05/bloomberg.png" },
    { name: "Business Insider", src: "https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/05/bz-insider.png" },
    { name: "CNBC", src: "https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-f5f47fa/cardonecapital.com/wp-content/uploads/2025/05/cnbc.png" },
  ];


  // We'll duplicate once for a seamless loop
  const logos = [...mediaLogos, ...mediaLogos];

  // Wait until first set of images (first half) are loaded before starting animation
  const loadedCount = useRef(0);
  const [isReady, setIsReady] = useState(false);

  const handleImageLoaded = (index: number) => {
    // only count loads for the first half of the duplicated array
    if (index < mediaLogos.length) {
      loadedCount.current += 1;
      if (loadedCount.current >= mediaLogos.length) {
        // small timeout to ensure layout has stabilized
        setTimeout(() => setIsReady(true), 50);
      }
    }
  };

  return (
    <section className="bg-gray-50 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Featured in
          </h2>
        </div>

        <div className="relative">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

          {/* track wrapper */}
          <div className="overflow-hidden">
            {/* track: inline-flex + whitespace-nowrap keeps widths stable */}
            <div
              className={
                "inline-flex whitespace-nowrap will-change-transform " +
                (isReady ? "animate-scroll" : "opacity-0")
              }
              // Optionally pause on hover via CSS class below
            >
              {logos.map((logo, index) => (
                <div
                  key={`${logo.name}-${index}`}
                  className="flex-shrink-0 inline-flex items-center justify-center px-6"
                  style={{ minWidth: 160 }} // fixed min width so halves match
                >
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={140}
                    height={80}
                    className="object-contain"
                    onLoadingComplete={() => handleImageLoaded(index)}
                    priority={index < mediaLogos.length ? true : false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* The keyframes move the track from -50% -> 0 (rightward).
           Because the track contains two identical halves, moving by 50% shows the second half
           exactly where the first was — making the loop visually continuous. */
        @keyframes carouselRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        .animate-carousel-right {
          animation: carouselRight 24s linear infinite;
        }

        /* pause on hover for UX */
        .animate-carousel-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default FeaturedLogosCarousel;
