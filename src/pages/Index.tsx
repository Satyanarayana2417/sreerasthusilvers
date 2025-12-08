import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import PromoTiles from "@/components/PromoTiles";
import BestSellers from "@/components/BestSellers";
import CategoryBand from "@/components/CategoryBand";
import CategoryGrid from "@/components/CategoryGrid";
import FeatureIcons from "@/components/FeatureIcons";
import TrendProducts from "@/components/TrendProducts";
import PromoSection from "@/components/PromoSection";
import SplitSection from "@/components/SplitSection";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import CollectionBanner from "@/components/CollectionBanner";
import NewsletterForm from "@/components/NewsletterForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroCarousel />
        <PromoTiles />
        <BestSellers />
        <CategoryBand />
        <CategoryGrid />
        <FeatureIcons />
        <TrendProducts />
        <PromoSection />
        <SplitSection />
        <TestimonialsCarousel />
        <CollectionBanner />
        <NewsletterForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
