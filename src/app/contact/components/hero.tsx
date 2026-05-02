import Image from "next/image";

const Hero = () => {
  return (
    <div className="relative w-full h-[300px]">
        <div className=" relative inset-0 h-[300px] w-full">
          <div className="absolute inset-0 w-full h-full z-10 bg-blue-800/60" />
          <h1 className="absolute inset-0 lg:text-5xl text-[32px] font-bold flex justify-center items-center text-white z-10">Contact Us</h1>
          <Image
            src="https://cardonecapital.com/wp-content/uploads/2025/06/A4C0DBC4-65B4-49CD-867C-F5E1A7A63B01.jpg"
            alt="Contact Us Banner"
            className="w-full h-[300px] object-cover"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </div>
  )
}

export default Hero