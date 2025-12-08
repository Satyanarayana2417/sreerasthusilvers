import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import unique from "@/assets/categories/unique.jpg";
import tide from "@/assets/categories/tide.jpg";
import organic from "@/assets/categories/organic.jpg";
import icons from "@/assets/categories/icons.jpg";

const categories = [
  { id: 1, name: "One-Of-A-Kinds", image: unique },
  { id: 2, name: "High Tide Looks", image: tide },
  { id: 3, name: "New Organic Döme", image: organic },
  { id: 4, name: "The Tiffany Icons", image: icons },
];

const CategoryGrid = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="section-padding">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.a
              key={category.id}
              href="#"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl aspect-[3/4] cursor-pointer"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent transition-colors group-hover:from-foreground/80" />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex items-end p-5 md:p-6">
                <h3 className="heading-sm text-primary-foreground transition-transform duration-300 group-hover:-translate-y-2">
                  {category.name}
                </h3>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
