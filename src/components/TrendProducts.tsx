import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import ProductCard from "./ProductCard";
import set1 from "@/assets/products/set-1.jpg";
import ring3 from "@/assets/products/ring-3.jpg";
import band1 from "@/assets/products/band-1.jpg";
import ring4 from "@/assets/products/ring-4.jpg";
import necklace2 from "@/assets/products/necklace-2.jpg";
import ring1 from "@/assets/products/ring-1.jpg";
import ring2 from "@/assets/products/ring-2.jpg";
import necklace1 from "@/assets/products/necklace-1.jpg";
import earrings1 from "@/assets/products/earrings-1.jpg";
import watch1 from "@/assets/products/watch-1.jpg";

const products = [
  {
    id: "t-001",
    title: "Gorgeous Golden Blossom Sets",
    category: "Rings, Wedding",
    price: 487.35,
    oldPrice: null,
    rating: 4.9,
    reviews: 5,
    badge: "Free Shipping Over ₹20,000",
    image: set1,
  },
  {
    id: "t-002",
    title: "10K Gold Eternity Ring",
    category: "Diamonds, Rings",
    price: 963.54,
    oldPrice: null,
    rating: 4.8,
    reviews: 5,
    discount: 63,
    image: ring3,
  },
  {
    id: "t-003",
    title: "Everyday Forever Band",
    category: "Necklaces & Pendants",
    price: 442.35,
    oldPrice: null,
    rating: 4.7,
    reviews: 5,
    image: band1,
  },
  {
    id: "t-004",
    title: "14k Gold Crew Helium Ring",
    category: "Gifts Set",
    price: 100.97,
    oldPrice: null,
    rating: 4.9,
    reviews: 5,
    image: ring4,
  },
  {
    id: "t-005",
    title: "Gold Heart Locket Necklace",
    category: "Necklaces & Pendants",
    price: 291.93,
    oldPrice: 796.70,
    rating: 4.8,
    reviews: 5,
    image: necklace2,
  },
  {
    id: "t-006",
    title: "Royal Diamond Signet",
    category: "Rings",
    price: 1299.00,
    oldPrice: 1599.00,
    rating: 5.0,
    reviews: 8,
    image: ring1,
  },
  {
    id: "t-007",
    title: "Elegant Solitaire Ring",
    category: "Diamonds, Rings",
    price: 2150.00,
    oldPrice: null,
    rating: 4.9,
    reviews: 12,
    image: ring2,
  },
  {
    id: "t-008",
    title: "Classic Chain Necklace",
    category: "Necklaces",
    price: 875.50,
    oldPrice: null,
    rating: 4.8,
    reviews: 6,
    image: necklace1,
  },
  {
    id: "t-009",
    title: "Pearl Drop Earrings",
    category: "Earrings",
    price: 345.00,
    oldPrice: 450.00,
    rating: 4.7,
    reviews: 9,
    image: earrings1,
  },
  {
    id: "t-010",
    title: "Luxury Gold Watch",
    category: "Watches",
    price: 1999.99,
    oldPrice: null,
    rating: 5.0,
    reviews: 15,
    image: watch1,
  },
];

const TrendProducts = () => {
  const ref = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll functionality (scrolling RIGHT - reverse direction)
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    const scrollSpeed = 1.5; // pixels per frame - same speed as BestSellers

    // Start from the middle (end of first set of products)
    const halfWidth = scrollContainer.scrollWidth / 2;
    scrollContainer.scrollLeft = halfWidth;
    let scrollPosition = halfWidth;

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition -= scrollSpeed; // Scroll right (decrease scrollLeft)
        
        // Reset scroll when reaching the beginning
        if (scrollPosition <= 0) {
          scrollPosition = halfWidth;
        }
        
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPaused]);

  // Duplicate products for seamless loop
  const duplicatedProducts = [...products, ...products];

  return (
    <section ref={ref} className="py-10 md:py-12">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>Trend Products of The Week</h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Our jewelry is made by the finest artists and carefully selected to reflect your style and personality
          </p>
        </motion.div>

        {/* Products Auto-Scroll Container - Scrolls RIGHT */}
        <div 
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {duplicatedProducts.map((product, index) => (
            <div 
              key={`${product.id}-${index}`} 
              className="flex-shrink-0 w-[45%] sm:w-[35%] md:w-[28%] lg:w-[18%]"
            >
              <ProductCard product={product} index={0} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendProducts;
