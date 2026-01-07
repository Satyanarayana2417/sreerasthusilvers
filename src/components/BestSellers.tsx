import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import ProductCard from "./ProductCard";
import ProductQuickView from "./ProductQuickView";
import { getBestSellers } from "@/services/productService";
import { UIProduct, adaptFirebaseArrayToUI } from "@/lib/productAdapter";

const BestSellers = () => {
  const ref = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<UIProduct | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const scrollPositionRef = useRef(0);
  const dragStartX = useRef(0);
  const dragScrollStart = useRef(0);
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch best sellers from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fbProducts = await getBestSellers(10);
        const uiProducts = adaptFirebaseArrayToUI(fbProducts);
        setProducts(uiProducts);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleQuickView = (product: UIProduct) => {
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
            {loading ? (
              // Loading skeleton
              Array.from({ length: 10 }).map((_, index) => (
                <div 
                  key={`skeleton-${index}`} 
                  className="flex-shrink-0 w-[45%] sm:w-[35%] md:w-[28%] lg:w-[18%]"
                >
                  <div className="animate-pulse">
                    <div className="bg-muted rounded-xl aspect-square mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              ))
            ) : products.length === 0 ? (
              // Empty state
              <div className="w-full py-12 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No best sellers available yet.</p>
              </div>
            ) : (
              duplicatedProducts.map((product, index) => (
                <div 
                  key={`${product.id}-${index}`} 
                  className="flex-shrink-0 w-[45%] sm:w-[35%] md:w-[28%] lg:w-[18%]"
                >
                  <ProductCard product={product} index={0} onQuickView={handleQuickView} />
                </div>
              ))
            )}
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
