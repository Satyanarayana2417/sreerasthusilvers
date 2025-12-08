import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import handmadeCrafting from "@/assets/handmade-crafting.jpg";

const SplitSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={ref} className="section-padding overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            style={{ y: imageY }}
            className="relative"
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="relative rounded-2xl overflow-hidden shadow-luxury-xl"
            >
              <img
                src={handmadeCrafting}
                alt="Artisan handcrafting jewelry"
                className="w-full h-auto object-cover aspect-[4/5]"
                loading="lazy"
              />
              {/* Decorative Element */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:pl-8"
          >
            <h2 className="heading-lg mb-6">
              All Of Our Jewellery Is Handmade.
            </h2>
            <p className="body-lg mb-8">
              A gift they'll treasure forever, Olight created diamonds jewelry combines precious metals with laboratory grown diamonds to form captivating collections. Each piece is crafted with ethically sourced precious metals to reflect our commitment to human rights and environmental sustainability.
            </p>
            <motion.a
              href="#explore"
              className="btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore More
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SplitSection;
