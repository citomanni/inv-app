import { Mail, Phone, Send } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const ContactDetails = () => {
  return (
    <div className="px-4 py-6 lg:w-[450px] w-full">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <div className="flex flex-col gap-5 items-start justify-between mb-10">
        <div className="flex gap-2 items-start">
          <Phone className="mt-1 mr-2 fill-black" />
          <div>
            <h1 className="font-bold text-xl">Phone</h1>
            <p>(305)407-0276</p>
          </div>
        </div>
        <div className="flex gap-2 items-start">
          <Mail className="mt-1 mr-2 fill-black stroke-white" />
          <div>
            <h1 className="font-bold text-xl">Email</h1>
            <Link href={""}>invest@cardonecapital.com</Link>
          </div>
        </div>
        <div className="flex gap-2 items-start">
          <Send className="mt-1 mr-2 fill-black" />
          <div>
            <h1 className="font-bold text-xl">Miami Headquarters</h1>
            <p className="max-w-56">
              18851 NE 29th Ave, Suite 1000 Aventura, FL 33180
            </p>
          </div>
        </div>
      </div>
      <div className="relative lg:w-[418px] md:w-[675px] lg:h-[200px] h-[40vw]">
        <div className="absolute z-10 w-fit h-fit p-2 bg-[#172E4E] text-white text-sm px-3 lg:-right-[13.1%] -right-[55px] bottom-0 lg:-translate-y-[153%] -translate-y-[150%] -rotate-90 ">
          Miami Headquartes
        </div>
        <Image
          src="https://cardonecapital.com/wp-content/uploads/2025/06/3-10XCENTRE-NEW-MARCH2025.jpg"
          alt="Contact Us Map"
          className="w-full h-auto object-cover"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
};

export default ContactDetails;
