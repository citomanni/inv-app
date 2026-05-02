"use client"
import React from 'react';

interface CarouselProps {
  images: string[];
  speed?: number; // pixels per second
}

const InfiniteImageCarousel: React.FC<CarouselProps> = ({
  images,
  speed = 50, // pixels per second
}) => {
  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images];

  // Calculate animation duration based on speed
  const imageWidth = 320; // Width of each image + gap
  const totalWidth = images.length * imageWidth;
  const duration = totalWidth / speed; // seconds for one complete loop

  return (
    <div className="carousel-container relative w-full max-w-6xl mx-auto bg-gray-200 overflow-hidden shadow-2xl">
      {/* Main carousel container */}
      <div className="relative h-52 overflow-hidden">
        <div
          className="carousel-track flex h-full"
          style={{
            width: `${duplicatedImages.length * imageWidth}px`,
          }}
        >
          {duplicatedImages.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="flex-shrink-0 mx-0.5 h-full"
              style={{ width: `${imageWidth + 60}px` }}
            >
              <img
                src={image}
                alt={`Slide ${index % images.length + 1}`}
                className="w-full cursor-pointer h-full object-cover mx-2"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .carousel-track {
          animation: slide 80s linear infinite;
        }
        
        .carousel-container:hover .carousel-track {
          animation-play-state: paused;
        }
        
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${totalWidth}px);
          }
        }
      `}</style>
    </div>
  );
};

export default InfiniteImageCarousel;