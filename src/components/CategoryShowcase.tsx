import { motion } from "framer-motion";
import uniqueImg from "@/assets/categories/unique.jpg";
import tideImg from "@/assets/categories/tide.jpg";
import organicImg from "@/assets/categories/organic.jpg";
import iconsImg from "@/assets/categories/icons.jpg";

const categories = [
  {
    id: 1,
    title: "One-Of-A-Kinds",
    subtitle: "RINGS",
    description: "Featuring unique and hand-sourced gemstones from all over the world.",
    cta: "See More Products",
    image: uniqueImg,
  },
  {
    id: 2,
    title: "High Tide Looks",
    subtitle: "BRACELETS",
    description: "Featuring unique and hand-sourced gemstones from all over the world.",
    cta: "See More Products",
    image: tideImg,
  },
  {
    id: 3,
    title: "New Organic Dôme",
    subtitle: "EARRINGS",
    description: "Featuring unique and hand-sourced gemstones from all over the world.",
    cta: "See More Products",
    image: organicImg,
  },
  {
    id: 4,
    title: "The Tiffany Icons",
    subtitle: "NECKLACES",
    description: "Featuring unique and hand-sourced gemstones from all over the world.",
    cta: "See More Products",
    image: iconsImg,
  },
];

const CategoryShowcase = () => {
  return (
    <section className="w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            className="relative group cursor-pointer overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {/* Background Image */}
            <div className="aspect-[3/4] relative">
              <img
                src={category.image}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Gradient Overlay - darker on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent transition-all duration-300 group-hover:from-black/70 group-hover:via-black/40" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end items-center p-6 text-white text-center">
                {/* Title - always visible at bottom */}
                <h3 
                  className="text-xl md:text-2xl font-medium mb-1 transition-all duration-300"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {category.title}
                </h3>
                
                {/* Subtitle/Product name - always visible */}
                <p className="text-xs uppercase tracking-[0.2em] text-white/80 mb-0 transition-all duration-300 group-hover:mb-3">
                  {category.subtitle}
                </p>
                
                {/* Description - hidden by default, visible on hover */}
                <p className="text-sm text-white/80 leading-relaxed max-h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-h-20 group-hover:opacity-100 group-hover:mb-4">
                  {category.description}
                </p>
                
                {/* CTA - hidden by default, visible on hover */}
                <a 
                  href="#" 
                  className="inline-block text-sm font-medium border-b border-white pb-1 hover:border-primary hover:text-primary max-h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-h-10 group-hover:opacity-100"
                >
                  {category.cta}
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategoryShowcase;
