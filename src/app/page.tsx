import FloatingWhatsapp from "@/components/landing/FloatingWhatsapp";
import Footer from "@/components/landing/Footer";
import GrowthStrategy from "@/components/landing/GrowthStrategy";
import Hero from "@/components/landing/Hero";
import IRA from "@/components/landing/IRA";
import Navbar from "@/components/landing/navbar";
import TrackRecord from "@/components/landing/TrackRecord";

const HomePage = () => {

  return (
    <main className="relative w-full overflow-x-hidden">
        <Navbar />
        <Hero />
        <GrowthStrategy />
        <TrackRecord />
        <IRA />
        <FloatingWhatsapp />
        <Footer />
    </main>
  );
};

export default HomePage;
