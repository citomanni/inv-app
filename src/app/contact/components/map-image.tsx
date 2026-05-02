'use client';

import useStaggeredFadeIn from '@/app/hooks/useFadeIn';

const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3591.234567890123!2d-80.1411891!3d25.9502166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9ade1c5b8313b%3A0x995c2ae70937d342!2sCardone%20Capital!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus";

export default function MapImage() {
 
    useStaggeredFadeIn(".fade-in-bottom", 150, 0.2, "bottom");

  return (
    <div className="fade-in-bottom opacity-0">
     
        <iframe
          className="w-full h-[300px] sm:h-[300px] sm:px-3 px-2 shadow-md border-0"
          src={mapEmbedUrl}
          allowFullScreen
          loading="lazy"
          title="Cardone Capital Location"
          aria-label="Interactive map showing Cardone Capital office location"
          referrerPolicy="no-referrer-when-downgrade"
        />
    </div>
  );
}