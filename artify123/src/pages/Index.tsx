import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CuratorPicks from "@/components/CuratorPicks";
import ArtworksGrid from "@/components/ArtworksGrid";
import StartGuide from "@/components/StartGuide";
import ArtistsSection from "@/components/ArtistsSection";
import BlogSection from "@/components/BlogSection";
import ShareWorkSection from "@/components/ShareWorkSection";
import CollectConfidence from "@/components/CollectConfidence";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CuratorPicks />
      <ArtworksGrid />
      <StartGuide />
      <ArtistsSection />
      <BlogSection />
      <ShareWorkSection />
      <CollectConfidence />
      <Footer />
    </div>
  );
};

export default Index;
