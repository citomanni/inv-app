import React from "react";

const IRA = () => {
  return (
    <section className="bg-black text-white py-[2rem] md:py-[0.6rem] px-6">
      <div className="max-w-[1120px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left space-y-1">
          <p className="text-lg  font-medium">
            INVEST WITH YOUR SELF-DIRECTED IRA OR 401K
          </p>
        </div>

        <div className="text-center md:text-left space-y-1">
        <p className="text-ld font-medium">
            TEXT “IRA” TO 305-407-0276
          </p>
        </div>
        <a
          href="/ira"
          className="inline-block bg-[#d93928] hover:bg-[#bf2f20] text-white text-sm md:text-base font-semibold px-5 py-[0.3rem] rounded transition shadow"
        >
          Learn More →
        </a>
      </div>
    </section>
  );
};

export default IRA;
