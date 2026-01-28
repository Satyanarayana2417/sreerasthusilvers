import { motion } from "framer-motion";
import { ArrowRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Import jewelry images
import necklaceImg from "@/assets/products/necklace-1.jpg";
import ringImg from "@/assets/products/ring-1.jpg";
import earringsImg from "@/assets/products/earrings-1.jpg";
import bandImg from "@/assets/products/band-1.jpg";
import setImg from "@/assets/products/set-1.jpg";
import necklace2Img from "@/assets/products/necklace-2.jpg";

const jewelryCategories = [
  {
    id: 1,
    title: "Necklaces",
    description: "Elegant silver necklaces",
    image: necklaceImg,
    href: "/shop/necklaces",
  },
  {
    id: 2,
    title: "Rings",
    description: "Exquisite silver rings",
    image: ringImg,
    href: "/shop/rings",
  },
  {
    id: 3,
    title: "Bracelets",
    description: "Stunning silver bracelets",
    image: bandImg,
    href: "/shop/bracelets",
  },
  {
    id: 4,
    title: "Anklets",
    description: "Delicate silver anklets",
    image: setImg,
    href: "/shop/anklets",
  },
  {
    id: 5,
    title: "Pendants",
    description: "Refined silver pendants",
    image: necklace2Img,
    href: "/shop/pendants",
  },
  {
    id: 6,
    title: "Earrings",
    description: "Graceful silver earrings",
    image: earringsImg,
    href: "/shop/earrings",
  },
];

const JewelryCollections = () => {
  return (
    <div className="min-h-screen w-full overflow-x-clip bg-white">
      <Header />
      
      <main>
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="container-custom py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link to="/" className="flex items-center gap-1 hover:text-primary transition-colors">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">Jewelry Collections</span>
            </div>
          </div>
        </div>

        {/* Category Grid */}
        <section className="py-12 md:py-20 bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {jewelryCategories.map((category, index) => (
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

        {/* Decorative Divider */}
        <section className="py-12 bg-gray-50">
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
      </main>

      <Footer />
    </div>
  );
};

export default JewelryCollections;
