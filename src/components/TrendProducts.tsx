import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import ProductQuickView from "./ProductQuickView";
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

type Product = typeof products[0];

const TrendProducts = () => {
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
  const scrollLeftBtn = () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    const scrollAmount = 300;
    const halfWidth = scrollContainer.scrollWidth / 2;
    scrollPositionRef.current = scrollPositionRef.current + scrollAmount;
    
    // Reset if we've scrolled past the halfway point
    if (scrollPositionRef.current >= halfWidth) {
      scrollPositionRef.current = scrollPositionRef.current - halfWidth;
    }
    
    scrollContainer.scrollTo({
      left: scrollPositionRef.current,
      behavior: 'smooth'
    });
  };

  const scrollRightBtn = () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    const scrollAmount = 300;
    const halfWidth = scrollContainer.scrollWidth / 2;
    scrollPositionRef.current = scrollPositionRef.current - scrollAmount;
    
    // Reset if we've gone below 0
    if (scrollPositionRef.current < 0) {
      scrollPositionRef.current = halfWidth + scrollPositionRef.current;
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

  // Auto-scroll functionality (scrolling RIGHT - reverse direction)
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    const scrollSpeed = 1.5; // pixels per frame - same speed as BestSellers

    // Start from the middle (end of first set of products)
    const halfWidth = scrollContainer.scrollWidth / 2;
    scrollContainer.scrollLeft = halfWidth;
    scrollPositionRef.current = halfWidth;

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollPositionRef.current -= scrollSpeed; // Scroll right (decrease scrollLeft)
        
        // Reset scroll when reaching the beginning
        if (scrollPositionRef.current <= 0) {
          scrollPositionRef.current = halfWidth;
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
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={scrollLeftBtn}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 bg-background/90 backdrop-blur-sm rounded-full shadow-luxury-md hover:bg-background transition-all hover:scale-110 focus-gold -ml-2 md:-ml-4"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={scrollRightBtn}
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

export default TrendProducts;
