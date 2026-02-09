import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const categories = [
  { 
    name: "Jewelry", 
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop",
    href: "/jewelry", 
    color: "bg-yellow-50" 
  },
  { 
    name: "Furniture", 
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop",
    href: "/furniture", 
    color: "bg-blue-50" 
  },
  { 
    name: "Articles", 
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=200&h=200&fit=crop",
    href: "/articles", 
    color: "bg-purple-50" 
  },
  { 
    name: "Other Products", 
    image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=200&h=200&fit=crop",
    href: "/products", 
    color: "bg-pink-50" 
  },
  { 
    name: "Fashion", 
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop",
    href: "#", 
    color: "bg-orange-50" 
  },
  { 
    name: "Home & Kitchen", 
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=200&h=200&fit=crop",
    href: "#", 
    color: "bg-green-50" 
  },
  { 
    name: "Beauty & Toys", 
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop",
    href: "#", 
    color: "bg-red-50" 
  },
  { 
    name: "Silver Chairs", 
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop",
    href: "/furniture/royal-silver-chairs", 
    color: "bg-amber-50" 
  },
  { 
    name: "Silver Coins", 
    image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=200&h=200&fit=crop",
    href: "/products/silver-coins", 
    color: "bg-yellow-50" 
  },
  { 
    name: "Gift Articles", 
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=200&h=200&fit=crop",
    href: "/products/silver-gift-articles", 
    color: "bg-teal-50" 
  },
];

const CategoryIconNav = () => {
  const location = useLocation();

  return (
    <section className="bg-white border-b border-gray-200 py-4 lg:py-6 shadow-sm z-40">
      <div className="container-custom max-w-full px-2 lg:px-4">
        <div className="flex items-center justify-between gap-3 lg:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          {categories.map((category, index) => {
            const isActive = location.pathname === category.href;
            
            return (
              <motion.a
                key={category.name}
                href={category.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center gap-2 lg:gap-3 min-w-[70px] lg:min-w-[100px] group flex-shrink-0 snap-start relative"
              >
                <div className={`w-14 h-14 lg:w-20 lg:h-20 rounded-full ${category.color} flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110 border-2 ${
                  isActive ? "border-blue-500 shadow-lg" : "border-gray-200"
                } shadow-md`}>
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-10 h-10 lg:w-12 lg:h-12 object-cover rounded"
                  />
                </div>
                <span className={`text-xs lg:text-sm font-semibold text-center whitespace-nowrap ${
                  isActive ? "text-blue-600" : "text-gray-800"
                }`}>
                  {category.name}
                </span>
                
                {/* Active Blue Bar */}
                {isActive && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute -bottom-4 left-0 right-0 h-0.5 lg:h-1 bg-blue-600 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.a>
            );
          })}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default CategoryIconNav;
