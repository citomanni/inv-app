import Navbar from "@/components/landing/navbar"
import Image from "next/image"

const Hero = () => {
  return (
      <>
      {/* Fixed Background Image covering entire page */}
      <div className="fixed top-0 left-[20px] w-[97%] h-[70vh] bg-cover bg-center bg-no-repeat z-0">
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Fixed Navbar on top of background */}
      <div className="relative top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <div className="relative top-0 z-20 p-4 bg-white h-[560px] xl:h-[580px]">
        <div className="relative -top-4 z-20 w-full rounded-2xl bg-transparent h-[560px] xl:h-[580px] overflow-hidden">
          <div
            className="absolute inset-0 h-[580px] min-[1450px]:bg-[length:1900px] bg-center"
            style={{
              backgroundImage:
                "url('/10x-investment-desktop-3.webp')",
              backgroundAttachment: "fixed",
              backgroundPositionY: "850px",
              backgroundPositionX: "0",
              // backgroundSize: "cover",
            }}
          >
            <div className="xl:hidden h-[580px] w-full relative">
              <Image
                src="/10x-investment-desktop-3.webp"
                alt="Investment Background"
                layout="fill"
                objectFit="cover lg:block  bg-bottom-right"
                className=""
                loading="lazy"
              />
            </div>
          </div>
          <section className="relative z-10 flex items-center justify-left">
            {/* Content */}
            <div className="text-left text-white px-4 pt-20 absolute xl:top-36 -top-7 left-5 xl:left-20">
              <h1 className="text-xl xl:text-5xl z-10 font-bold max-w-2xl mb-6">
                46 ASSETS | $5.3 Billion AUM 14,600 MULTIFAMILY UNITS 500,000
                FT² OFFICE SPACE
              </h1>
              <p>
                $1.72 Billion raised since 2016, helping over 19,000 investors
                build passive income at scale.
              </p>
            </div>
          </section>
        </div>
      </div>
      </>
  )
}

export default Hero
