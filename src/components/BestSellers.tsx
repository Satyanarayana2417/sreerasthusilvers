import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import ProductCard from "./ProductCard";
import ring1 from "@/assets/products/ring-1.jpg";
import earrings1 from "@/assets/products/earrings-1.jpg";
import watch1 from "@/assets/products/watch-1.jpg";
import necklace1 from "@/assets/products/necklace-1.jpg";
import necklace2 from "@/assets/products/necklace-2.jpg";
import ring2 from "@/assets/products/ring-2.jpg";
import ring3 from "@/assets/products/ring-3.jpg";
import ring4 from "@/assets/products/ring-4.jpg";
import band1 from "@/assets/products/band-1.jpg";
import set1 from "@/assets/products/set-1.jpg";

const products = [
  {
    id: "p-001",
    title: "14k Gold Bespoke Signet Ring",
    category: "Rings",
    price: 922.56,
    oldPrice: 509.22,
    rating: 4.9,
    reviews: 5,
    image: ring1,
    alt: "14k gold signet ring",
  },
  {
    id: "p-002",
    title: "Faded Grandeur Stud Earrings",
    category: "Accessories, Pearls",
    price: 93.30,
    oldPrice: null,
    rating: 4.8,
    reviews: 5,
    image: earrings1,
    alt: "Elegant stud earrings",
  },
  {
    id: "p-003",
    title: "Awesome Wooden Watch",
    category: "Earrings",
    price: 729.94,
    oldPrice: null,
    rating: 4.7,
    reviews: 5,
    image: watch1,
    alt: "Luxury wooden watch",
  },
  {
    id: "p-004",
    title: "Gorgeous Aluminum Necklace",
    category: "Earrings",
    price: 556.96,
    oldPrice: null,
    rating: 4.9,
    reviews: 5,
    image: necklace1,
    alt: "Gorgeous necklace",
  },
  {
    id: "p-005",
    title: "Diamond Lou Helium Ring",
    category: "Pearls",
    price: 223.99,
    oldPrice: null,
    rating: 4.8,
    reviews: 5,
    image: ring2,
    alt: "Diamond helium ring",
  },
  {
    id: "p-006",
    title: "Elegant Pearl Necklace",
    category: "Necklaces",
    price: 1299.99,
    oldPrice: 1599.99,
    rating: 5.0,
    reviews: 12,
    image: necklace2,
    alt: "Elegant pearl necklace",
  },
  {
    id: "p-007",
    title: "Classic Diamond Band",
    category: "Rings",
    price: 1850.00,
    oldPrice: null,
    rating: 4.9,
    reviews: 8,
    image: band1,
    alt: "Classic diamond band",
  },
  {
    id: "p-008",
    title: "Vintage Rose Gold Ring",
    category: "Rings",
    price: 675.50,
    oldPrice: 899.00,
    rating: 4.7,
    reviews: 15,
    image: ring3,
    alt: "Vintage rose gold ring",
  },
  {
    id: "p-009",
    title: "Royal Sapphire Ring",
    category: "Rings",
    price: 2450.00,
    oldPrice: null,
    rating: 5.0,
    reviews: 3,
    image: ring4,
    alt: "Royal sapphire ring",
  },
  {
    id: "p-010",
    title: "Bridal Jewelry Set",
    category: "Sets",
    price: 3999.99,
    oldPrice: 4999.99,
    rating: 4.9,
    reviews: 20,
    image: set1,
    alt: "Bridal jewelry set",
  },
];

const BestSellers = () => {
  const ref = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll functionality
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 1.5; // pixels per frame

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += scrollSpeed;
        
        // Reset scroll when reaching the middle (since we duplicated products)
        const halfWidth = scrollContainer.scrollWidth / 2;
        if (scrollPosition >= halfWidth) {
          scrollPosition = 0;
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
    <section ref={ref} className="py-12 md:py-16 bg-secondary/50">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-foreground" style={{ fontFamily: "'Montserrat', sans-serif" }}>Our Best Sellers</h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Our jewelry is made by the finest artists and carefully selected to reflect your style and personality.
          </p>
        </motion.div>

        {/* Products Auto-Scroll Container */}
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

export default BestSellers;
