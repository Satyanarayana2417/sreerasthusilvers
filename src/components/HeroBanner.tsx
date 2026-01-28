import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { subscribeToActiveBanners, Banner } from "@/services/bannerService";
import { useNavigate } from "react-router-dom";
import heroPearlNecklace from "@/assets/hero-pearl-necklace.png";
import heroSilverJewelry from "@/assets/hero-silver-jewelry.png";
import heroGoldenJewelry from "@/assets/hero-golden-jewelry.png";

// Fallback banners for empty state
const FALLBACK_BANNERS: Banner[] = [
  {
    imageUrl: heroPearlNecklace,
    redirectLink: "/jewelry",
    order: 1,
    status: "active",
  },
  {
    imageUrl: heroSilverJewelry,
    redirectLink: "/jewelry",
    order: 2,
    status: "active",
  },
  {
    imageUrl: heroGoldenJewelry,
    redirectLink: "/jewelry",
    order: 3,
    status: "active",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80",
    redirectLink: "/shop",
    order: 4,
    status: "active",
  },
];

const HeroBanner = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(true);

  // Real-time subscription to active banners
  useEffect(() => {
    const unsubscribe = subscribeToActiveBanners(
      (activeBanners) => {
        // If no active banners, show fallback
        if (activeBanners.length === 0) {
          setBanners(FALLBACK_BANNERS);
        } else {
          setBanners(activeBanners);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error loading banners:', error);
        setBanners(FALLBACK_BANNERS);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 2500);

    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    if (banners.length <= 1) return;
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    if (banners.length <= 1) return;
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleBannerClick = () => {
    const currentBanner = banners[currentSlide];
    if (currentBanner.redirectLink.startsWith('http')) {
      window.open(currentBanner.redirectLink, '_blank');
    } else {
      navigate(currentBanner.redirectLink);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      nextSlide();
    } else if (swipe > swipeConfidenceThreshold) {
      prevSlide();
    }
  };

  if (loading) {
    return (
      <section className="relative h-[180px] lg:h-[200px] flex items-center justify-center bg-gray-100 mx-3 my-4 lg:mx-0 lg:my-0 rounded-2xl lg:rounded-none">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </section>
    );
  }

  return (
    <section className="relative lg:h-[200px] overflow-hidden px-3 py-4 lg:px-0 lg:py-0">
      {/* Mobile: Boxed with curved borders */}
      <div className="lg:hidden rounded-2xl overflow-hidden shadow-lg">
        <div className="relative h-[180px]">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
              onClick={handleBannerClick}
              className="absolute inset-0 cursor-pointer"
            >
              <img
                src={banners[currentSlide].imageUrl}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator - Mobile */}
          {banners.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDirection(index > currentSlide ? 1 : -1);
                    setCurrentSlide(index);
                  }}
                  className={`h-2.5 rounded-full transition-all shadow-md ${
                    index === currentSlide ? "bg-white w-7" : "bg-white/60 hover:bg-white/80 w-2.5"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop: Full width */}
      <div className="hidden lg:block relative h-[200px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            onClick={handleBannerClick}
            className="absolute inset-0 cursor-pointer"
          >
            <img
              src={banners[currentSlide].imageUrl}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dots Indicator - Desktop */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setDirection(index > currentSlide ? 1 : -1);
                  setCurrentSlide(index);
                }}
                className={`h-2.5 rounded-full transition-all shadow-md ${
                  index === currentSlide ? "bg-white w-7" : "bg-white/60 hover:bg-white/80 w-2.5"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;
