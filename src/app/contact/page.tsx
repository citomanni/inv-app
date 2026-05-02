import { Metadata } from "next";
import Navbar from "@/components/landing/navbar";
import ContactForm from "./components/contact-form";
import ContactDetails from "./components/contact-details";
import Hero from "./components/hero";
import MapImage from "./components/map-image";
import Footer from "@/components/landing/Footer";
import FloatingWhatsapp from "@/components/landing/FloatingWhatsapp";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Suite B107, 1st floor Block B, Millennium Builders Plaza, Plot 251 Herbert Macaulay Way, Opposite NNPC Towers, Central Business District, Abuja. olclarehomes@gmail.com +234 803 483 0864 +234 803 749 7787",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <Navbar />
      <Hero />
      <div className="flex lg:flex-row flex-col-reverse w-full max-w-6xl mx-auto justify-between mt-6 ">
        <ContactDetails />
        <ContactForm />
      </div>
      <div className="lg:mt-16 mt-6 mb-4">
        <MapImage />
      </div>
      <FloatingWhatsapp />
      <Footer />
    </main>
  );
}
