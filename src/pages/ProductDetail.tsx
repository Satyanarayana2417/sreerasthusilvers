import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Heart, Minus, Plus, ChevronRight, ShoppingBag, Truck, Shield, RotateCcw, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import necklace1 from "@/assets/products/necklace-1.jpg";
import necklace2 from "@/assets/products/necklace-2.jpg";

interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  oldPrice?: number | null;
  rating: number;
  reviews: number;
  image: string;
  alt: string;
  description?: string;
}

// All products data (in a real app, this would come from an API)
const allProducts: Product[] = [
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
    description: "Elevate your style with these exquisite Crystal Accent Gold Hoops. Crafted with precision and adorned with sparkling crystals, these hoops are perfect for both everyday elegance and special occasions. The lustrous gold finish complements any outfit, making them a versatile addition to your jewelry collection.",
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
    description: "A timeless piece crafted from premium 14k gold, this Crew Helium Ring features a sleek, modern design that transitions effortlessly from day to night. Its comfortable fit and durable construction make it perfect for daily wear.",
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
    description: "Symbolize eternal love with our Classic Eternity Ring Set. This stunning collection features intricately designed rings that represent infinite commitment and timeless beauty. Perfect for engagements, anniversaries, or as a meaningful gift.",
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
    description: "Embrace sophistication with our Elegant Pearl Necklace. Each pearl is hand-selected for its lustrous quality and perfectly matched to create a seamless strand. This classic piece adds refined elegance to any ensemble.",
  },
  {
    id: "n-005",
    title: "Diamond Studded Bracelet",
    category: "Bracelets",
    price: 2499.99,
    oldPrice: 2999.99,
    rating: 5,
    reviews: 8,
    image: necklace1,
    alt: "Diamond Studded Bracelet",
    description: "Make a statement with our Diamond Studded Bracelet. Featuring genuine diamonds set in premium metal, this bracelet catches the light beautifully and adds instant glamour to your wrist.",
  },
  {
    id: "n-006",
    title: "Silver Anklet with Charms",
    category: "Anklets",
    price: 399.99,
    oldPrice: null,
    rating: 4,
    reviews: 15,
    image: necklace2,
    alt: "Silver Anklet with Charms",
    description: "Add a touch of whimsy to your look with our Silver Anklet featuring delicate charms. Perfect for summer days or adding a playful element to your jewelry collection.",
  },
];

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Find the product
  const product = allProducts.find((p) => p.id === productId);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-screen w-full">
        <Header />
        <main className="container-custom py-20 text-center">
          <h1 className="text-2xl font-semibold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/shop/necklaces")}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all"
          >
            Back to Shop
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Generate SKU
  const sku = `sreerasthu-${product.category.toLowerCase().replace(/[^a-z]/g, "-")}-${product.id}`;

  // Mock images for gallery
  const productImages = [product.image, product.image, product.image, product.image];

  // Related products
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen w-full overflow-x-clip">
      <Header />
      <main>
        {/* Breadcrumb */}
        <section className="bg-secondary/30 py-2">
          <div className="container-custom">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <ChevronRight className="w-4 h-4" />
              <a href="/shop/necklaces" className="hover:text-primary transition-colors">Shop</a>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">{product.title}</span>
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
                <div className="relative bg-muted rounded-2xl overflow-hidden aspect-[4/3] max-w-lg mx-auto mb-4">
                  <img
                    src={productImages[selectedImage]}
                    alt={product.alt}
                    className="w-full h-full object-cover"
                  />
                  {product.oldPrice && (
                    <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full">
                      SALE
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
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

                {/* Quantity & Actions */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
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
      <Footer />
    </div>
  );
};

export default ProductDetail;
