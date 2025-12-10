import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import ring1 from "@/assets/products/ring-1.jpg";
import ring2 from "@/assets/products/ring-2.jpg";
import ring3 from "@/assets/products/ring-3.jpg";
import necklace1 from "@/assets/products/necklace-1.jpg";
import earrings1 from "@/assets/products/earrings-1.jpg";
import band1 from "@/assets/products/band-1.jpg";

const images = [
  { id: 1, src: ring1, alt: "Heart pendant necklace" },
  { id: 2, src: ring2, alt: "Gold chain bracelet" },
  { id: 3, src: ring3, alt: "Wedding rings" },
  { id: 4, src: necklace1, alt: "Flower pendant" },
  { id: 5, src: earrings1, alt: "Gold earrings" },
  { id: 6, src: band1, alt: "Designer earrings" },
];

const InstagramGallery = () => {
  return (
    <section className="pt-4 pb-8 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramGallery;
