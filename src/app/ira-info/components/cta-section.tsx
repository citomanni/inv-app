import { Download } from "lucide-react"
import Image from "next/image"

const CtaSection = () => {
  return (
              <div
                className="bg-cover bg-no-repeat bg-left rounded-2xl lg:px-8 px-4 lg:py-1 py-6 text-white relative"
                style={{
                  backgroundColor: "#316C1F",
                  backgroundImage:
                    "url('https://cdn-ildekjf.nitrocdn.com/xhlnKMYSHTlpnyFoqMDGzqOfGSDLjGui/assets/images/optimized/rev-aca49c2/cardonecapital.com/wp-content/uploads/2025/05/footer_cc.jpg')",
                }}
              >
                <div className="md:px-4 flex md:flex-row flex-col justify-between lg:gap-0 md:gap-10 gap-4 items-center">
                  <div className="relative z-10">
                    <div className=" text-center">
                      <div className="text-[#E53935] font-extrabold md:text-[24px] text-[20px] leading-[2rem]">
                        GET YOUR FREE <br /> DIGITAL COPY
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="md:text-[22px] text-[17px] text-center font-bold text-white">
                        LEARN MORE ABOUT <br /> THE BENEFITS
                      </h3>
                      <p className="text-white font-light text-center md:text-base text-[14px]">
                        OF SELF-DIRECTING YOUR IRA OR 401K
                        <br />
                        TO INVEST WITH CARDONE CAPITAL
                      </p>
                    </div>

                    <div className="w-full flex justify-center">
                      <button className="bg-[#316C1F] hover:bg-[#316C1F]/80 text-white py-2 px-9 rounded-md flex items-center transition-colors">
                        <Download className="w-5 h-5 mr-2" />
                        Download
                      </button>
                    </div>
              </div>
               {/* Book Image */}
                  <div className="flex justify-center items-center">
                    <Image
                      src="/booker.png"
                      alt="Book Image"
                      width={1900}
                      height={980}
                      className="lg:w-[228px] bounce md:w-[318px] w-[70%] md:h-auto lg:h-[320px] object-contain"
                    />
                  </div>
                </div>
              </div>
  )
}

export default CtaSection