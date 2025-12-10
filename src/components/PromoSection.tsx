import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import promoNecklace from "@/assets/promo-necklace.jpg";
import promoEarrings from "@/assets/promo-earrings.jpg";

const promos = [
  {
    id: 1,
    eyebrow: "LUXURY NECKLACE",
    title: "Best Friend Jewelry",
    subtitle: "A wide range of exquisite necklaces",
    cta: "Shop Now",
    image: promoNecklace,
  },
  {
    id: 2,
    eyebrow: "OUR EARRINGS",
    title: "Diamond Stud Earrings",
    subtitle: "A wide range of exquisite earrings",
    cta: "Shop Now",
    image: promoEarrings,
  },
];

const PromoSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="w-full">
      <div className="grid md:grid-cols-2">
        {promos.map((promo, index) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="group relative overflow-hidden"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={promo.image}
                alt={promo.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            
            {/* Content Overlay */}
            <div 
              className="relative z-10 p-8 md:p-12 lg:p-16 min-h-[400px] md:min-h-[450px] flex flex-col justify-center"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/80 block mb-3 font-semibold">
                {promo.eyebrow}
              </span>
              <p className="text-sm text-foreground/70 mb-5 max-w-[180px] leading-relaxed font-medium">
                {promo.subtitle}
              </p>
              <div>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-foreground text-xs font-semibold tracking-wide rounded-full hover:bg-foreground hover:text-background transition-colors shadow-sm"
                >
                  {promo.cta}
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PromoSection;
