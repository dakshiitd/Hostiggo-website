import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/features/HeroSection";
import PopularStays from "@/components/features/PopularStays";
import CTABanner from "@/components/features/CTABanner";
import {
  DELHI_PROPERTIES,
  DEHRADUN_PROPERTIES,
  DELHI_PROPERTIES_2,
  DELHI_PROPERTIES_3,
} from "@/constants/data";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FFFEF9]">
      <Navbar />
      <HeroSection />
      <div className="container-main py-8 space-y-10">
        <PopularStays title="Popular stays in Delhi" properties={DELHI_PROPERTIES} />
        <PopularStays title="Popular stays in Himachal Pradesh" properties={DEHRADUN_PROPERTIES} />
        <CTABanner />
        <PopularStays title="Popular stays in Rajasthan & Goa" properties={DELHI_PROPERTIES_2} />
        <PopularStays title="Popular stays in South India" properties={DELHI_PROPERTIES_3} />
      </div>
      <Footer />
    </div>
  );
}
