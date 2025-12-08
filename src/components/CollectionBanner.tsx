import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import collectionBanner from "@/assets/collection-banner.jpg";

const CollectionBanner = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl"
        >
          <img
            src={collectionBanner}
            alt="Olight Collection"
            className="w-full h-[400px] md:h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container-custom">
              <div className="max-w-lg text-primary-foreground">
                <span className="eyebrow text-primary-light block mb-2">OLIGHT COLLECTION</span>
                <h2 className="heading-lg mb-4">Shop The Latest Trends</h2>
                <p className="body-lg text-primary-foreground/80 mb-6">
                  Exceptional Handcrafted Design to Enhance the Magnificent Glow
                </p>
                <a href="#" className="btn-primary bg-primary-foreground text-foreground hover:bg-primary-foreground/90">
                  Shop Now
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CollectionBanner;
