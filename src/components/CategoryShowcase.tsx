import { motion } from "framer-motion";
import { useState } from "react";
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
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const handleCardClick = (id: number) => {
    // On mobile, toggle the active state
    setActiveCard(activeCard === id ? null : id);
  };

  return (
    <section className="w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            className={`relative group cursor-pointer overflow-hidden ${activeCard === category.id ? 'active' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => handleCardClick(category.id)}
          >
            {/* Background Image */}
            <div className="aspect-[4/5] relative">
              <img
                src={category.image}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 lg:group-hover:scale-105"
              />
              
              {/* Gradient Overlay - darker on hover/active */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent transition-all duration-300 ${activeCard === category.id ? 'lg:from-black/70 lg:via-black/40' : ''} lg:group-hover:from-black/70 lg:group-hover:via-black/40`} />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end items-center p-4 text-white text-center">
                {/* Title - always visible at bottom */}
                <h3 
                  className="text-base md:text-xl font-medium mb-1 transition-all duration-300"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {category.title}
                </h3>
                
                {/* Subtitle/Product name - always visible */}
                <p className={`text-xs uppercase tracking-[0.2em] text-white/80 transition-all duration-300 ${activeCard === category.id ? 'mb-2' : 'mb-0 lg:group-hover:mb-2'}`}>
                  {category.subtitle}
                </p>
                
                {/* Description - hidden by default, visible on tap (mobile) or hover (desktop) */}
                <p className={`text-xs text-white/80 leading-relaxed overflow-hidden transition-all duration-300 ${activeCard === category.id ? 'max-h-16 opacity-100 mb-3' : 'max-h-0 opacity-0 lg:group-hover:max-h-16 lg:group-hover:opacity-100 lg:group-hover:mb-3'}`}>
                  {category.description}
                </p>
                
                {/* CTA - hidden by default, visible on tap (mobile) or hover (desktop) */}
                <a 
                  href="#" 
                  className={`inline-block text-xs font-medium border-b border-white pb-1 hover:border-primary hover:text-primary overflow-hidden transition-all duration-300 ${activeCard === category.id ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0 lg:group-hover:max-h-10 lg:group-hover:opacity-100'}`}
                  onClick={(e) => e.stopPropagation()}
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
