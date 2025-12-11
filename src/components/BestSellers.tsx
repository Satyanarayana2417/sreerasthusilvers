import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import ProductQuickView from "./ProductQuickView";
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

type Product = typeof products[0];

const BestSellers = () => {
  const ref = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const scrollPositionRef = useRef(0);
  const dragStartX = useRef(0);
  const dragScrollStart = useRef(0);

  const handleQuickView = (product: Product) => {
    if (!isDragging) {
      setSelectedProduct(product);
      setIsQuickViewOpen(true);
    }
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setSelectedProduct(null);
  };

  // Manual scroll functions
  const scrollLeft = () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    const scrollAmount = 300;
    scrollPositionRef.current = Math.max(0, scrollPositionRef.current - scrollAmount);
    scrollContainer.scrollTo({
      left: scrollPositionRef.current,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    const scrollAmount = 300;
    const halfWidth = scrollContainer.scrollWidth / 2;
    scrollPositionRef.current = Math.min(halfWidth, scrollPositionRef.current + scrollAmount);
    
    // Reset if we've scrolled past the halfway point
    if (scrollPositionRef.current >= halfWidth) {
      scrollPositionRef.current = 0;
    }
    
    scrollContainer.scrollTo({
      left: scrollPositionRef.current,
      behavior: 'smooth'
    });
  };

  // Handle drag/swipe scrolling
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setIsPaused(true);
    dragStartX.current = clientX;
    dragScrollStart.current = scrollPositionRef.current;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || !scrollRef.current) return;
    
    const diff = dragStartX.current - clientX;
    const halfWidth = scrollRef.current.scrollWidth / 2;
    let newPosition = dragScrollStart.current + diff;
    
    // Handle wrapping
    if (newPosition < 0) {
      newPosition = halfWidth + newPosition;
    } else if (newPosition >= halfWidth) {
      newPosition = newPosition - halfWidth;
    }
    
    scrollPositionRef.current = newPosition;
    scrollRef.current.scrollLeft = newPosition;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    // Small delay before resuming auto-scroll
    setTimeout(() => setIsPaused(false), 1000);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Auto-scroll functionality
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    const scrollSpeed = 1.5; // pixels per frame

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollPositionRef.current += scrollSpeed;
        
        // Reset scroll when reaching the middle (since we duplicated products)
        const halfWidth = scrollContainer.scrollWidth / 2;
        if (scrollPositionRef.current >= halfWidth) {
          scrollPositionRef.current = 0;
        }
        
        scrollContainer.scrollLeft = scrollPositionRef.current;
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
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 bg-background/90 backdrop-blur-sm rounded-full shadow-luxury-md hover:bg-background transition-all hover:scale-110 focus-gold -ml-2 md:-ml-4"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 bg-background/90 backdrop-blur-sm rounded-full shadow-luxury-md hover:bg-background transition-all hover:scale-110 focus-gold -mr-2 md:-mr-4"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <div 
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-hidden px-2 cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {duplicatedProducts.map((product, index) => (
              <div 
                key={`${product.id}-${index}`} 
                className="flex-shrink-0 w-[45%] sm:w-[35%] md:w-[28%] lg:w-[18%]"
              >
                <ProductCard product={product} index={0} onQuickView={handleQuickView} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Quick View Modal */}
      <ProductQuickView
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={closeQuickView}
      />
    </section>
  );
};

export default BestSellers;
