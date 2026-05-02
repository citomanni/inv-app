import React from "react";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/Footer";
import Hero from "./components/hero";
import CeoMessage from "./components/ceo-message";
import FeaturedLogosCarousel from "./components/logo-carousel";
import GoogleReviewsSection from "./components/google-review";
import WealthThroughRealEstate from "./components/wealth-feature";

const CompanyOverview = () => {
  return (
    <main>
      <Navbar />
          <Hero />
          <CeoMessage />
          <FeaturedLogosCarousel />
          <GoogleReviewsSection />
          <WealthThroughRealEstate />
          <Footer />
    </main>
  );
};

export default CompanyOverview;
