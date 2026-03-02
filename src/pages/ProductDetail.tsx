import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Heart, Minus, Plus, ChevronRight, ShoppingBag, Truck, Shield, RotateCcw, Check, Loader2, X, ChevronLeft, ArrowLeft } from "lucide-react";
import { getProduct, getActiveProducts } from "@/services/productService";
import { UIProductDetail, adaptFirebaseToUIDetail, adaptFirebaseArrayToUI } from "@/lib/productAdapter";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<UIProductDetail | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<UIProductDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Fetch product and related products
  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch the main product
        const fbProduct = await getProduct(productId);
        
        if (!fbProduct) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const uiProduct = adaptFirebaseToUIDetail(fbProduct);
        setProduct(uiProduct);

        // Fetch all active products for related products
        const allActiveProducts = await getActiveProducts();
        const related = allActiveProducts
          .filter(p => p.id !== productId)
          .slice(0, 4)
          .map(adaptFirebaseToUIDetail);
        setRelatedProducts(related);
      } catch (error) {
        console.error("Error fetching product:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      // Add items based on quantity
      for (let i = 0; i < quantity; i++) {
        await addToCart({
          id: product.id,
          name: product.title,
          price: product.price,
          image: product.image,
          category: product.category || 'Products',
        });
      }
      
      // Show success state
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
      
      // Show toast notification
      toast({
        title: "Added to cart",
        description: `${product.title} (${quantity}) has been added to your cart.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    try {
      // Add items based on quantity
      for (let i = 0; i < quantity; i++) {
        await addToCart({
          id: product.id,
          name: product.title,
          price: product.price,
          image: product.image,
          category: product.category || 'Products',
        });
      }
      // Navigate to checkout
      navigate('/checkout');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Swipe handlers for image popup
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && selectedImage < productImages.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
    if (isRightSwipe && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen w-full">
        <main className="container-custom py-20 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  // Product not found
  if (notFound || !product) {
    return (
      <div className="min-h-screen w-full">
        <main className="container-custom py-20 text-center">
          <h1 className="text-2xl font-semibold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/shop/necklaces")}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all"
          >
            Back to Shop
          </button>
        </main>
      </div>
    );
  }

  // Generate SKU
  const sku = `sreerasthu-${product.category.toLowerCase().replace(/[^a-z]/g, "-")}-${product.id}`;

  // Product images for gallery - only show unique images
  const productImages = [product.image];

  return (
    <div className="min-h-screen w-full overflow-x-clip">
      <main>
        {/* Mobile Back Button */}
        <div className="lg:hidden bg-white sticky top-0 z-40 shadow-sm px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        {/* Breadcrumb */}
        <section className="hidden lg:block bg-secondary/30 py-2">
          <div className="container-custom">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <ChevronRight className="w-4 h-4" />
              <a href="/shop/necklaces" className="hover:text-primary transition-colors">Shop</a>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">
                {product.title.length > 20 ? product.title.slice(0, 20) + '...' : product.title}
              </span>
            </div>
          </div>
        </section>

        {/* Product Details Section */}
        <section className="py-4 md:py-8">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Product Images */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Main Image */}
                <div 
                  className="relative bg-muted rounded-2xl overflow-hidden aspect-[4/3] max-w-lg mx-auto mb-4 cursor-pointer md:cursor-default"
                  onClick={() => window.innerWidth < 768 && setShowImagePopup(true)}
                >
                  <img
                    src={productImages[selectedImage]}
                    alt={product.alt}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thumbnail Gallery - only show if multiple images */}
                {productImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 max-w-lg mx-auto">
                    {productImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index
                            ? "border-primary"
                            : "border-transparent hover:border-primary/50"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.title} view ${index + 1}`}
                          className="w-full h-full object-contain p-1"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {/* Category */}
                <span className="text-sm uppercase tracking-wider text-primary font-medium mb-2">
                  {product.category}
                </span>

                {/* Title */}
                <h1 
                  className="text-lg md:text-3xl lg:text-4xl font-semibold text-foreground mb-3 md:mb-4"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {product.title}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? "fill-primary text-primary"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground">
                    ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl md:text-4xl font-bold text-foreground">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  {product.oldPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      ₹{product.oldPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                  {product.oldPrice && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                      Save ₹{(product.oldPrice - product.price).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-border my-4" />

                {/* Description */}
                <p className="text-xs md:text-base text-muted-foreground leading-relaxed mb-4 md:mb-6">
                  {product.description ||
                    `Exquisitely crafted with attention to detail. This stunning piece from our ${product.category} collection showcases timeless elegance and superior craftsmanship.`}
                </p>

                {/* Quantity & Actions - Hidden on mobile, shown on desktop */}
                <div className="hidden md:flex flex-wrap items-center gap-4 mb-6">
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-border rounded-full overflow-hidden">
                    <button
                      onClick={decrementQuantity}
                      className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <motion.button
                    onClick={handleAddToCart}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 min-w-[180px] px-8 py-3.5 font-medium text-sm rounded-full transition-all flex items-center justify-center gap-2 ${
                      addedToCart
                        ? "bg-green-500 text-white"
                        : "bg-foreground text-background hover:bg-foreground/90"
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="w-5 h-5" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        Add to Cart
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`flex items-center gap-2 mb-6 transition-colors ${
                    isWishlisted
                      ? "text-red-500"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Heart
                    className="w-5 h-5"
                    fill={isWishlisted ? "currentColor" : "none"}
                  />
                  {isWishlisted ? "Added to Wishlist" : "Add To Wishlist"}
                </button>

                {/* Features */}
                <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8">
                  <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:p-3 bg-secondary/50 rounded-lg md:rounded-xl text-center md:text-left">
                    <Truck className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                    <span className="text-[10px] md:text-sm leading-tight">Free Shipping</span>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:p-3 bg-secondary/50 rounded-lg md:rounded-xl text-center md:text-left">
                    <Shield className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                    <span className="text-[10px] md:text-sm leading-tight">2 Year Warranty</span>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:p-3 bg-secondary/50 rounded-lg md:rounded-xl text-center md:text-left">
                    <RotateCcw className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                    <span className="text-[10px] md:text-sm leading-tight">Easy Returns</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border my-4" />

                {/* Category */}
                <div className="text-sm">
                  <p>
                    <span className="text-muted-foreground">Category:</span>{" "}
                    <a href="/shop/necklaces" className="text-primary hover:underline">
                      {product.category}
                    </a>
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="py-8 md:py-12 bg-secondary/30">
          <div className="container-custom">
            <h2
              className="text-xl md:text-3xl font-semibold text-center mb-6 md:mb-8"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              You May Also Like
            </h2>
            {/* Mobile: Horizontal Scroll */}
            <div className="md:hidden flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {relatedProducts.map((relatedProduct) => (
                <motion.a
                  key={relatedProduct.id}
                  href={`/product/${relatedProduct.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group flex-shrink-0 w-32"
                >
                  <div className="relative bg-muted rounded-lg overflow-hidden aspect-square mb-2">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors text-xs text-center line-clamp-2">
                    {relatedProduct.title}
                  </h3>
                  <p className="text-center font-semibold mt-1 text-xs">
                    ₹{relatedProduct.price.toLocaleString("en-IN")}
                  </p>
                </motion.a>
              ))}
            </div>
            {/* Desktop: Grid */}
            <div className="hidden md:grid grid-cols-4 lg:grid-cols-5 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <motion.a
                  key={relatedProduct.id}
                  href={`/product/${relatedProduct.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="relative bg-muted rounded-lg overflow-hidden aspect-square mb-2">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors text-xs md:text-sm text-center line-clamp-2">
                    {relatedProduct.title}
                  </h3>
                  <p className="text-center font-semibold mt-1 text-sm">
                    ₹{relatedProduct.price.toLocaleString("en-IN")}
                  </p>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Fixed Bottom Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
        <div className="flex gap-3">
          <motion.button
            onClick={handleAddToCart}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-3.5 font-medium text-sm rounded-full border-2 border-gray-300 bg-white text-gray-800 flex items-center justify-center gap-2"
          >
            {addedToCart ? (
              <>
                <Check className="w-5 h-5" />
                Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Add to cart
              </>
            )}
          </motion.button>
          <motion.button
            onClick={handleBuyNow}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-3.5 font-semibold text-sm rounded-full bg-black text-white flex items-center justify-center"
          >
            Buy at ₹{product?.price.toLocaleString("en-IN")}
          </motion.button>
        </div>
      </div>

      {/* Full Screen Image Popup for Mobile */}
      {showImagePopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="md:hidden fixed inset-0 bg-black z-[100] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-black/80">
            <span className="text-white text-sm">
              {selectedImage + 1} / {productImages.length}
            </span>
            <button
              onClick={() => setShowImagePopup(false)}
              className="text-white p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Image Container with Swipe */}
          <div
            className="flex-1 flex items-center justify-center relative"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <motion.img
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              src={productImages[selectedImage]}
              alt={product?.alt}
              className="max-w-full max-h-full object-contain p-4"
            />

            {/* Navigation Arrows */}
            {productImages.length > 1 && (
              <>
                {selectedImage > 0 && (
                  <button
                    onClick={() => setSelectedImage(selectedImage - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 rounded-full p-2"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                )}
                {selectedImage < productImages.length - 1 && (
                  <button
                    onClick={() => setSelectedImage(selectedImage + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 rounded-full p-2"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                )}
              </>
            )}
          </div>

          {/* Thumbnail Dots */}
          {productImages.length > 1 && (
            <div className="flex justify-center gap-2 p-4 bg-black/80">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    selectedImage === index ? "bg-white w-4" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Bottom padding for mobile to account for fixed bar */}
      <div className="md:hidden h-20"></div>
    </div>
  );
};

export default ProductDetail;
