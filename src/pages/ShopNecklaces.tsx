import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, ShoppingBag, Check, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import necklace1 from "@/assets/products/necklace-1.jpg";
import necklace2 from "@/assets/products/necklace-2.jpg";

// Necklace products data
const necklaceProducts = [
  {
    id: "n-001",
    title: "Crystal Accent Gold Hoops",
    category: "Earrings, Gifts Set",
    price: 952.26,
    oldPrice: null,
    rating: 5,
    reviews: 5,
    image: necklace1,
    alt: "Crystal Accent Gold Hoops",
  },
  {
    id: "n-002",
    title: "14k Gold Crew Helium Ring",
    category: "Gifts Set",
    price: 100.97,
    oldPrice: null,
    rating: 5,
    reviews: 5,
    image: necklace2,
    alt: "14k Gold Crew Helium Ring",
  },
  {
    id: "n-003",
    title: "Classic Eternity Ring Sets",
    category: "Gifts Set",
    price: 487.35,
    oldPrice: null,
    rating: 4,
    reviews: 5,
    image: necklace1,
    alt: "Classic Eternity Ring Sets",
  },
  {
    id: "n-004",
    title: "Elegant Pearl Necklace",
    category: "Necklaces",
    price: 1299.99,
    oldPrice: 1599.99,
    rating: 5,
    reviews: 12,
    image: necklace2,
    alt: "Elegant Pearl Necklace",
  },
  {
    id: "n-005",
    title: "Diamond Heart Pendant",
    category: "Necklaces, Pendants",
    price: 2150.00,
    oldPrice: null,
    rating: 5,
    reviews: 8,
    image: necklace1,
    alt: "Diamond Heart Pendant",
  },
  {
    id: "n-006",
    title: "Gold Chain Necklace",
    category: "Necklaces",
    price: 875.50,
    oldPrice: 1050.00,
    rating: 4,
    reviews: 15,
    image: necklace2,
    alt: "Gold Chain Necklace",
  },
  {
    id: "n-007",
    title: "Ruby Studded Necklace",
    category: "Necklaces, Gems",
    price: 3450.00,
    oldPrice: null,
    rating: 5,
    reviews: 3,
    image: necklace1,
    alt: "Ruby Studded Necklace",
  },
  {
    id: "n-008",
    title: "Vintage Pearl String",
    category: "Necklaces, Pearls",
    price: 1650.00,
    oldPrice: 1999.00,
    rating: 5,
    reviews: 20,
    image: necklace2,
    alt: "Vintage Pearl String",
  },
  {
    id: "n-009",
    title: "Modern Choker Necklace",
    category: "Necklaces",
    price: 750.00,
    oldPrice: null,
    rating: 4,
    reviews: 7,
    image: necklace1,
    alt: "Modern Choker Necklace",
  },
];

type Product = typeof necklaceProducts[0];

type SortOption = 'default' | 'price-low-high' | 'price-high-low' | 'newest' | 'best-rating';

interface CartItem {
  product: Product;
  quantity: number;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  productTitle?: string;
}

const ShopNecklaces = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info', productTitle?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type, productTitle }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sorted products based on selected option
  const sortedProducts = useMemo(() => {
    const products = [...necklaceProducts];
    
    switch (sortBy) {
      case 'price-low-high':
        return products.sort((a, b) => a.price - b.price);
      case 'price-high-low':
        return products.sort((a, b) => b.price - a.price);
      case 'newest':
        return products.sort((a, b) => b.id.localeCompare(a.id));
      case 'best-rating':
        return products.sort((a, b) => {
          if (b.rating !== a.rating) return b.rating - a.rating;
          return b.reviews - a.reviews;
        });
      default:
        return products;
    }
  }, [sortBy]);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const toggleWishlist = (productId: string, productTitle: string) => {
    setWishlist((prev) => {
      const isInWishlist = prev.includes(productId);
      if (isInWishlist) {
        showToast('Removed from wishlist', 'info', productTitle);
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to wishlist', 'success', productTitle);
        return [...prev, productId];
      }
    });
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        showToast('Quantity updated in cart', 'success', product.title);
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        showToast('Added to cart', 'success', product.title);
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  // Calculate cart totals
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="min-h-screen w-full overflow-x-clip">
      <Header />
      <main>
        {/* Page Header */}
        <section className="bg-secondary/30 py-8 md:py-10">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Necklaces
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
               
              </p>
              {/* Breadcrumb */}
              <div className="mt-3 text-sm text-muted-foreground">
                <a href="/" className="hover:text-primary transition-colors">Home</a>
                <span className="mx-2">/</span>
                <a href="#" className="hover:text-primary transition-colors">Shop</a>
                <span className="mx-2">/</span>
                <span className="text-foreground">Necklaces</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-8 md:py-10">
          <div className="container-custom">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-muted-foreground">
                Showing <span className="text-foreground font-medium">{sortedProducts.length}</span> results
              </p>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="default">Default Sorting</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="best-rating">Best Rating</option>
              </select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {sortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => handleProductClick(product.id)}
                >
                  {/* Product Card */}
                  <div className="relative bg-muted rounded-xl overflow-hidden aspect-square mb-4">
                    <img
                      src={product.image}
                      alt={product.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Wishlist Button - Always visible on mobile, hover on desktop */}
                    <div className="absolute top-3 right-3 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id, product.title);
                        }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          wishlist.includes(product.id)
                            ? "text-red-500"
                            : "text-white/90 hover:text-red-500"
                        }`}
                        style={{ 
                          textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                        }}
                        aria-label={wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart
                          className="w-5 h-5"
                          fill={wishlist.includes(product.id) ? "currentColor" : "none"}
                          strokeWidth={2}
                        />
                      </motion.button>
                    </div>

                    {/* Add to Cart Button - Desktop only (hover) */}
                    <div className="hidden md:block absolute bottom-3 left-3 right-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-2.5 bg-white/20 backdrop-blur-sm text-white border border-white/40 rounded-full hover:bg-white/30 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                        style={{
                          textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                        }}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Add to Cart
                      </motion.button>
                    </div>

                    {/* Sale Badge */}
                    {product.oldPrice && (
                      <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
                        SALE
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2 text-center">
                    {/* Category */}
                    <span className="text-xs uppercase tracking-wider text-primary font-medium">
                      {product.category}
                    </span>

                    {/* Title */}
                    <h3
                      className="font-medium text-foreground group-hover:text-primary transition-colors text-sm md:text-base"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {product.title}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center justify-center gap-0.5 md:gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 md:w-3.5 md:h-3.5 ${
                            i < product.rating
                              ? "fill-primary text-primary"
                              : "fill-muted text-muted-foreground"
                          }`}
                        />
                      ))}
                      <span className="text-[10px] md:text-xs text-muted-foreground ml-0.5 md:ml-1">
                        ({product.reviews})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-semibold text-foreground">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.oldPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.oldPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button - Mobile only */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="md:hidden w-full py-2 mt-2 bg-primary/10 text-primary border border-primary/30 rounded-full hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2 text-xs font-medium"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Toast Notifications */}
      <AnimatePresence>
        {toasts.length > 0 && (
          <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3">
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.9 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[280px] ${
                  toast.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : toast.type === 'error'
                    ? 'bg-red-50 border border-red-200 text-red-800'
                    : 'bg-blue-50 border border-blue-200 text-blue-800'
                }`}
              >
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  toast.type === 'success'
                    ? 'bg-green-500'
                    : toast.type === 'error'
                    ? 'bg-red-500'
                    : 'bg-blue-500'
                }`}>
                  {toast.type === 'success' ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : toast.type === 'error' ? (
                    <X className="w-4 h-4 text-white" />
                  ) : (
                    <Heart className="w-3 h-3 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{toast.message}</p>
                  {toast.productTitle && (
                    <p className="text-xs opacity-75 truncate max-w-[200px]">{toast.productTitle}</p>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 p-1 hover:bg-black/10 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShopNecklaces;
