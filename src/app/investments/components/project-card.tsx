"use client";

import useStaggeredFadeIn from "@/app/hooks/useFadeIn";

const ProjectCard = ({
  image,
  image_desc,
  title,
  location,
  isOverSuscribed,
  totalUnits,
  targeted_irr,
  target_equity_multiple,
  onClick
}: {
  image: string;
  image_desc: string;
  title: string;
  location: string;
  isOverSuscribed: boolean;
  target_equity_multiple: string | number;
  targeted_irr: string | number;
    totalUnits: string | number;
    onClick?: () => void;

  }) => {
   useStaggeredFadeIn(".fade-in-child", 180, 0.1, "left");

  return (
   <div 
      className={`group relative cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 fade-in-child`}
      onClick={onClick}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View project ${title} in ${location}`}
    >
      {/* Project Image */}
      <div className="overflow-hidden relative">
        <img
          src={image}
          alt={image_desc}
          className="w-full h-[420px] md:h-[420px] object-cover transform group-hover:blur-[3px] group-hover:scale-110 transition-transform duration-700 ease-in-out"
          loading="lazy"
        />
     
      </div>
        <div className="absolute bg-black/10 z-10 top-0 h-full  w-full group-hover:bg-slate-500/70"></div>

      {/* Text Overlay */}
      <h3 className="text-[12px] absolute top-2 rounded-md left-2 right-0 w-fit px-2 py-2 bg-gradient-to-b from-slate-600 to-slate-800 text-white font-medium shadow-sm hover:from-slate-500 hover:to-slate-700 transition-all duration-200 font-serif mb-2 group-hover:blur-sm">
        {title}
      </h3>
      {isOverSuscribed && (
        <h3 className="text-[12px] absolute top-2 rounded right-2 w-fit px-2 py-2 bg-gradient-to-b from-red-500 to-red-700 text-white font-medium shadow-sm group-hover:blur-sm hover:from-red-400 hover:to-red-600 transition-all duration-200 font-serif mb-2">
          Oversubscribed
        </h3>
      )}
      <div className="absolute bottom-3 group-hover:blur-[2px]">
        {/* Location Description */}
        <p className="text-sm md:text-base tracking-wide uppercase text-white z-20 font-bold px-4 py-2  ">
          {location}
        </p>


        <h1 className="px-4 py-2 text-white text-2xl md:max-w-xs font-bold">{title}</h1>
          </div>
          
          
        <div className="absolute w-full z-20 top-0 h-full justify-center items-center flex-col text-center hidden gap-3 group-hover:flex">
          <div className="">
            <h1 className="text-3xl text-white font-bold">{totalUnits}</h1>
            <p className="uppercase text-sm text-white/70"> Total Units</p>
          </div>
          <div>
            <h1 className="text-3xl text-white font-bold">{targeted_irr}</h1>
            <p className="uppercase text-sm text-white/70"> Targeted IRR</p>
          </div>
          <div>
            <h1 className="text-3xl text-white font-bold">{target_equity_multiple}</h1>
            <p className="uppercase text-sm text-white/70">Target Equity Multiple</p>
          </div>
        </div>
    </div>
  );
};

export default ProjectCard;
