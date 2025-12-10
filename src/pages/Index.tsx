import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import PromoTiles from "@/components/PromoTiles";
import MarqueeBand from "@/components/MarqueeBand";
import LuxurySofaSection from "@/components/LuxurySofaSection";
import BestSellers from "@/components/BestSellers";
import CategoryShowcase from "@/components/CategoryShowcase";
import FeatureIcons from "@/components/FeatureIcons";
import TrendProducts from "@/components/TrendProducts";
import PromoSection from "@/components/PromoSection";
import FreeShippingBand from "@/components/FreeShippingBand";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import CollectionBanner from "@/components/CollectionBanner";
import NewsletterForm from "@/components/NewsletterForm";
import InstagramGallery from "@/components/InstagramGallery";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen w-full overflow-x-clip">
      <Header />
      <main>
        <HeroCarousel />
        <PromoTiles />
        <MarqueeBand />
        <LuxurySofaSection />
        <BestSellers />
        <CategoryShowcase />
        <FeatureIcons />
        <TrendProducts />
        <PromoSection />
        <FreeShippingBand />
        <TestimonialsCarousel />
        <CollectionBanner />
        <NewsletterForm />
        <InstagramGallery />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
