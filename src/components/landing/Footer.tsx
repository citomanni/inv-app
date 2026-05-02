import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPhoneAlt } from "react-icons/fa";
import { HiOutlineMail, HiLocationMarker } from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="bg-[#1a1e29] text-white px-6 pt-12 pb-6 text-sm bg-cover bg-no-repeat bg-center"
    style={{
      backgroundColor: "#1c2d49",
      backgroundImage:
        "url('/footer_bg.webp')",
    }}>
      <div className="max-w-[1140px] mx-auto flex flex-col md:flex-row gap-10">
        
        {/* Left Section - 40% on desktop */}
        <div className="w-full md:w-[40%] flex flex-col md:flex-row md:gap-10">
          <div className="flex gap-4 flex-col">
          <div className="space-y-4">
            <Image src="/logo-white.png" alt="Cardone Capital" width={200} height={80} />
            <div>
              <p className="font-semibold">Follow us</p>
              <div className="flex gap-4 mt-2 text-white">
                <a href="#"><FaFacebookF /></a>
                <a href="#"><FaInstagram /></a>
                <a href="#"><FaLinkedinIn /></a>
              </div>
            </div>
          </div>

          {/* Insights + Phone */}
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="font-semibold mb-2">Insights & Resources</h4>
              <ul className="space-y-1 text-gray-300">
                <li><Link href="/bitcoin">Bitcoin</Link></li>
                <li><Link href="/free-books">Free Books</Link></li>
                <li><Link href="/articles">Latest Articles</Link></li>
                <li><Link href="/non-accredited">Non Accredited</Link></li>
              </ul>
            </div>
            <div className="flex items-center gap-2 text-gray-300 pt-2">
              <FaPhoneAlt className="text-base" />
              <span>+1 305 407 0276</span>
            </div>
          </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-2">Legal</h4>
            <ul className="space-y-1 text-gray-300">
              <li><Link href="/faqs">FAQs</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms and Conditions</Link></li>
              <li><Link href="/disclosures">Disclosures</Link></li>
            </ul>
          </div>
        </div>

        {/* Right Section - 60% on desktop */}
        <div className="w-full md:w-[60%] text-gray-400 text-xs leading-relaxed">
          <p className="text-justify">
            <strong className="text-white">Investing involves risk, including loss of principal.</strong> Past performance does not guarantee or indicate future results. Any historical returns, expected returns, or probability projections may not reflect actual future performance. While the data we use from third parties is believed to be reliable, we cannot ensure the accuracy or completeness of data provided by investors or other third parties. Neither Cardone Capital nor any of its affiliates provide tax advice and do not represent in any manner that the outcomes described herein will result in any particular tax consequence. Offers to sell, or solicitations of offers to buy, any security can only be made through official offering documents that contain important information about investment objectives, risks, fees and expenses. Bitcoin is highly speculative and its actual performance may not match investor expectation. Prospective investors should consult with a tax, legal and/or financial adviser before making any investment decision. For additional important risks, disclosures, and information, please visit https://cardonecapital.com/disclosures/
          </p>
        </div>
      </div>

      {/* Bottom Info Row */}
      <div className="max-w-[1140px] mx-auto mt-10 grid md:grid-cols-3 gap-6 text-xs text-gray-400 border-t border-gray-700 pt-6">
        {/* Email */}
        <div className="flex items-center gap-2">
          <HiOutlineMail className="text-lg" />
          <span>invest@cardonecapital.com</span>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2">
          <HiLocationMarker className="text-lg mt-1" />
          <span>
            18851 NE 29th Ave<br />
            Suite 1000 Aventura, FL 33180
          </span>
        </div>

        {/* Bottom Links & Copyright */}
        <div className="flex flex-col md:items-end gap-2 text-right">
          <div className="space-x-4">
            <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
          <p className="text-gray-500">&copy; {new Date().getFullYear()} Cardone Capital</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
