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
    <section ref={ref} className="section-padding bg-secondary/30">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-6">
          {promos.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative overflow-hidden rounded-2xl bg-card shadow-luxury-md"
            >
              <div className="grid md:grid-cols-2 items-center">
                {/* Content */}
                <div className="p-6 md:p-8 order-2 md:order-1">
                  <span className="eyebrow block mb-2">{promo.eyebrow}</span>
                  <h3 className="heading-md mb-2">{promo.title}</h3>
                  <p className="body-md mb-6">{promo.subtitle}</p>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 text-foreground font-medium text-sm tracking-wider uppercase group/link"
                  >
                    {promo.cta}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </a>
                </div>

                {/* Image */}
                <div className="aspect-square overflow-hidden order-1 md:order-2">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
