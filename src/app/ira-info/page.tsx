"use client";

import Footer from "@/components/landing/Footer";
import CtaSection from "./components/cta-section";
import HeroText from "./components/hero-text";
import Form from "./components/form";
import Navbar from "@/components/landing/navbar";

const IraPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 lg:pb-40">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="space-y-4 col-span-2">
              <HeroText />
              <CtaSection />
            </div>
            <Form />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default IraPage;
