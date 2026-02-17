import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Home, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { subscribeToProducts } from "@/services/productService";
import { UIProduct, adaptFirebaseArrayToUI } from "@/lib/productAdapter";

// Import product images (using available images as placeholders)
import setImg from "@/assets/products/set-1.jpg";

const productsCategories = [
  {
    id: 1,
    title: "Silver Idols",
    description: "Divine silver idols",
    image: setImg,
    href: "/products/silver-idols",
  },
  {
    id: 2,
    title: "Silver Pooja Items",
    description: "Sacred pooja essentials",
    image: setImg,
    href: "/products/silver-pooja-items",
  },
  {
    id: 3,
    title: "Silver Gift Articles",
    description: "Exquisite silver gifts",
    image: setImg,
    href: "/products/silver-gift-articles",
  },
  {
    id: 4,
    title: "Custom Engraved Items",
    description: "Personalized silver pieces",
    image: setImg,
    href: "/products/custom-engraved-items",
  },
  {
    id: 5,
    title: "Silver Coins",
    description: "Premium silver coins",
    image: setImg,
    href: "/products/silver-coins",
  },
];

const OtherProductsCollections = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products from Firebase and filter by other products categories
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToProducts(
      (fbProducts) => {
        const uiProducts = adaptFirebaseArrayToUI(fbProducts);
        // Filter only other products (idols, pooja items, gift articles, coins, custom items)
        const otherProducts = uiProducts.filter(product => {
          // Check if category contains other products keywords
          const categoryLower = (product.category || '').toLowerCase();
          return categoryLower.includes('idol') || 
                 categoryLower.includes('pooja item') || 
                 categoryLower.includes('gift') || 
                 categoryLower.includes('coin') || 
                 categoryLower.includes('engrav') ||
                 categoryLower.includes('custom') ||
                 categoryLower.includes('limited');
        });
        setProducts(otherProducts);
        setLoading(false);
      },
      true // activeOnly
    );
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-white">
      <div className="hidden md:block">
        <Header />
      </div>
      
      <main>
        {/* Mobile Header with Back Button */}
        <div className="md:hidden sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>Other Products</h1>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-200 hidden md:block">
          <div className="container-custom py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link to="/" className="flex items-center gap-1 hover:text-primary transition-colors">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">Other Products</span>
            </div>
          </div>
        </div>

        {/* Category Grid */}
        <section className="py-4 md:py-20 bg-white">
          <div className="container-custom">
            {/* Mobile: Horizontal Scroll */}
            <div className="md:hidden flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide">
              {productsCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  className="flex-shrink-0"
                >
                  <Link 
                    to={category.href}
                    className="group block"
                  >
                    <div className="relative overflow-hidden flex flex-col items-center">
                      {/* Small Circular Image for Mobile */}
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-2 relative">
                        <img
                          src={category.image}
                          alt={category.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Category Info */}
                      <div className="text-center max-w-[96px]">
                        <h3 
                          className="text-sm font-serif font-light text-foreground"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {category.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {/* Desktop: Grid */}
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {productsCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <Link 
                    to={category.href}
                    className="group block"
                  >
                    <div className="relative overflow-hidden flex flex-col items-center">
                      {/* Image Container - Circular */}
                      <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden bg-gray-100 mb-6 relative">
                        <img
                          src={category.image}
                          alt={category.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
                          <span className="text-white font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            Explore Collection
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>

                      {/* Category Info */}
                      <div className="text-center">
                        <h3 
                          className="text-2xl md:text-3xl font-serif font-light text-foreground mb-2 group-hover:text-primary transition-colors duration-300"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {category.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Decorative Divider - Hidden on Mobile */}
        <section className="hidden md:block py-12 bg-gray-50">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="py-8"
              >
                <p className="text-sm uppercase tracking-widest text-primary mb-4">Crafted with Precision</p>
                <h2 
                  className="text-3xl md:text-4xl font-serif font-light text-foreground mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Where Tradition Meets Contemporary Design
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Every piece is meticulously crafted using premium silver, 
                  ensuring lasting beauty and exceptional quality.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* All Products Grid - Mobile Only */}
        <section className="md:hidden py-4 bg-white">
          <div className="container-custom px-4">
            {loading ? (
              <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-square rounded-lg mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
};

export default OtherProductsCollections;
