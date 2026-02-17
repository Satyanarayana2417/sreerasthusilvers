import { motion } from "framer-motion";
import { Star, Heart, Eye, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from "@/hooks/useWishlist";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  oldPrice?: number | null;
  rating: number;
  reviews: number;
  image: string;
  alt?: string;
  badge?: string;
  discount?: number;
}

interface ProductCardProps {
  product: Product;
  index?: number;
  onQuickView?: (product: Product) => void;
}

const ProductCard = ({ product, index = 0, onQuickView }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigate to product detail page
    navigate(`/product/${product.id}`);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView?.(product);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id, product.title);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    console.log('🛒 Add to Cart clicked for:', product.title);
    console.log('📦 Product ID:', product.id);
    
    try {
      await addToCart({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
      });
      
      console.log('✅ Successfully added to cart');
      
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
      });
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="product-card group cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="product-card-image relative bg-muted rounded-2xl overflow-hidden aspect-square mb-3">
        <img
          src={product.image}
          alt={product.alt || product.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Wishlist Heart - Top Right */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all"
          aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${
              isInWishlist(product.id) 
                ? "text-red-500 fill-red-500" 
                : "text-gray-700 hover:text-red-500"
            }`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="space-y-1.5">
        {/* Category */}
        <span className="text-xs uppercase tracking-wider font-medium" style={{ color: '#D4AF37' }}>
          {product.category}
        </span>

        {/* Title - Single Line with Ellipsis */}
        <h4 className="font-medium text-base leading-snug text-gray-900 truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {product.title}
        </h4>

        {/* Rating - Without Review Count */}
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(product.rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-xl font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product.oldPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Add to Cart Button - Black Transparent Pill */}
        <button
          onClick={handleAddToCart}
          className="w-full mt-2 py-2.5 px-4 bg-black/5 text-gray-900 text-sm font-medium rounded-full hover:bg-black/10 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 border border-gray-200"
        >
          <ShoppingBag className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
