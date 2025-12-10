import { motion } from "framer-motion";
import { Star, Heart, Eye, ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: {
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
  };
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="product-card group"
    >
      {/* Image Container */}
      <div className="product-card-image relative bg-muted rounded-xl overflow-hidden aspect-square mb-4">
        <img
          src={product.image}
          alt={product.alt || product.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Badges */}
        {product.discount && (
          <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded-full">
            {product.discount}% OFF
          </div>
        )}
        {product.badge && (
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full gold-shimmer">
            {product.badge}
          </div>
        )}

        {/* Quick Actions */}
        <div className="product-card-actions">
          <button
            className="p-3 bg-background rounded-full shadow-luxury-md hover:bg-primary hover:text-primary-foreground transition-all transform hover:scale-110 focus-gold"
            aria-label="Add to wishlist"
          >
            <Heart className="w-4 h-4" />
          </button>
          <button
            className="p-3 bg-background rounded-full shadow-luxury-md hover:bg-primary hover:text-primary-foreground transition-all transform hover:scale-110 focus-gold"
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="p-3 bg-background rounded-full shadow-luxury-md hover:bg-primary hover:text-primary-foreground transition-all transform hover:scale-110 focus-gold"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        {/* Category */}
        <span className="text-xs uppercase tracking-wider text-primary font-medium">
          {product.category}
        </span>

        {/* Title */}
        <h4 className="font-heading text-lg font-medium leading-snug group-hover:text-primary transition-colors">
          {product.title}
        </h4>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating)
                    ? "fill-primary text-primary"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviews} Reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">₹{product.price.toLocaleString('en-IN')}</span>
          {product.oldPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{product.oldPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
