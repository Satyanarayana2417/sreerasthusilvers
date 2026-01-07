import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Trash2, ArrowLeft, Package } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/useWishlist";
import { getProduct } from "@/services/productService";
import { UIProduct, adaptFirebaseToUI } from "@/lib/productAdapter";
import { useAuth } from "@/contexts/AuthContext";

const Wishlist = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { wishlist, removeFromWishlist, isLoaded } = useWishlist();
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlistProducts = async () => {
      if (!isLoaded) return;
      
      setLoading(true);
      try {
        const productPromises = wishlist.map(id => getProduct(id));
        const fbProducts = await Promise.all(productPromises);
        const validProducts = fbProducts.filter(p => p !== null);
        const uiProducts = validProducts.map(p => adaptFirebaseToUI(p!));
        setProducts(uiProducts);
      } catch (error) {
        console.error('Error loading wishlist products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlistProducts();
  }, [wishlist, isLoaded]);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleRemove = (productId: string, productTitle: string) => {
    removeFromWishlist(productId, productTitle);
  };

  if (loading || !isLoaded) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen"
      >
        {/* Hero Banner Section */}
        <section className="relative h-[200px] md:h-[280px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60 z-10" />
            <img 
              src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1600&q=80" 
              alt="My Wishlist"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="relative z-20 container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  My Wishlist
                </h1>
              </div>
              <p className="text-white/90 text-lg md:text-xl mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {products.length} {products.length === 1 ? 'item' : 'items'} saved for later
              </p>
              
              {/* Breadcrumb */}
              <div className="text-sm text-white/80 flex items-center justify-center gap-2">
                <button onClick={() => navigate("/")} className="hover:text-white transition-colors">
                  Home
                </button>
                <span>/</span>
                <span className="text-white">Wishlist</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <div className="container mx-auto px-4 py-8 sm:py-12 bg-background">
          {products.length === 0 ? (
            // Empty State
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12 sm:py-20"
            >
              {/* Box Icon */}
              <div className="relative mb-8">
                <div className="w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
                  <div className="relative">
                    {/* Main Box */}
                    <div className="w-40 h-40 sm:w-52 sm:h-52 border-8 border-foreground/80 rounded-lg relative bg-background">
                      {/* Box Flap */}
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-12 sm:h-16 border-8 border-foreground/80 border-b-0 rounded-t-lg bg-background"></div>
                      
                      {/* Tape Lines */}
                      <div className="absolute top-1/2 left-0 right-0 h-4 bg-foreground/20 -translate-y-1/2"></div>
                      <div className="absolute top-0 bottom-0 left-1/2 w-4 bg-foreground/20 -translate-x-1/2"></div>
                    </div>
                    
                    {/* Small boxes beside */}
                    <div className="absolute -right-12 bottom-4 w-10 h-10 border-4 border-foreground/60 rounded bg-background rotate-12"></div>
                    <div className="absolute -right-8 bottom-0 w-8 h-8 border-4 border-foreground/60 rounded bg-background -rotate-6"></div>
                  </div>
                </div>
              </div>

              {/* Text */}
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                My Wishlist is Empty!
              </h2>
              <p className="text-muted-foreground text-center mb-8 max-w-md">
                {user 
                  ? "Feels heavy to even start adding your favorite items!"
                  : "Please login to start adding your favorite items to wishlist"
                }
              </p>
              <div className="flex gap-4">
                {!user && (
                  <Button
                    onClick={() => navigate("/auth/login")}
                    size="lg"
                    className="gap-2"
                  >
                    Login to Continue
                  </Button>
                )}
                <Button
                  onClick={() => navigate("/")}
                  variant={user ? "default" : "outline"}
                  size="lg"
                  className="gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Start Shopping
                </Button>
              </div>
            </motion.div>
          ) : (
            // Product Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-border"
                  >
                    {/* Product Image */}
                    <div
                      className="relative aspect-square overflow-hidden cursor-pointer bg-muted"
                      onClick={() => handleProductClick(product.id)}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <ShoppingBag className="w-16 h-16 text-muted-foreground/30" />
                        </div>
                      )}
                      
                      {/* Remove Button Overlay */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(product.id, product.title);
                          }}
                          className="rounded-full shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Sale Badge */}
                      {product.oldPrice && product.oldPrice > product.price && (
                        <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                          {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 space-y-3">
                      <div className="space-y-1">
                        <h3
                          className="font-semibold text-foreground line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => handleProductClick(product.id)}
                        >
                          {product.title}
                        </h3>
                        {product.category && (
                          <p className="text-sm text-muted-foreground">
                            {product.category}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-primary">
                              ₹{product.price.toLocaleString()}
                            </span>
                            {product.oldPrice && product.oldPrice > product.price && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{product.oldPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleRemove(product.id, product.title)}
                          className="rounded-full"
                        >
                          <Heart className="w-4 h-4" fill="currentColor" />
                        </Button>
                      </div>

                      <Button
                        onClick={() => handleProductClick(product.id)}
                        className="w-full gap-2"
                        variant="outline"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        View Details
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
      <Footer />
    </>
  );
};

export default Wishlist;