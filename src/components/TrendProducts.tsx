import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ProductCard from "./ProductCard";
import set1 from "@/assets/products/set-1.jpg";
import ring3 from "@/assets/products/ring-3.jpg";
import band1 from "@/assets/products/band-1.jpg";
import ring4 from "@/assets/products/ring-4.jpg";
import necklace2 from "@/assets/products/necklace-2.jpg";

const products = [
  {
    id: "t-001",
    title: "Gorgeous Golden Blossom Sets",
    category: "Rings, Wedding",
    price: 487.35,
    oldPrice: null,
    rating: 4.9,
    reviews: 5,
    badge: "Free Shipping Over $240",
    image: set1,
  },
  {
    id: "t-002",
    title: "10K Gold Eternity Ring",
    category: "Diamonds, Rings",
    price: 963.54,
    oldPrice: null,
    rating: 4.8,
    reviews: 5,
    discount: 63,
    image: ring3,
  },
  {
    id: "t-003",
    title: "Everyday Forever Band",
    category: "Necklaces & Pendants",
    price: 442.35,
    oldPrice: null,
    rating: 4.7,
    reviews: 5,
    image: band1,
  },
  {
    id: "t-004",
    title: "14k Gold Crew Helium Ring",
    category: "Gifts Set",
    price: 100.97,
    oldPrice: null,
    rating: 4.9,
    reviews: 5,
    image: ring4,
  },
  {
    id: "t-005",
    title: "Gold Heart Locket Necklace",
    category: "Necklaces & Pendants",
    price: 291.93,
    oldPrice: 796.70,
    rating: 4.8,
    reviews: 5,
    image: necklace2,
  },
];

const TrendProducts = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="section-padding">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-lg mb-4">Trend Products of The Week</h2>
          <p className="body-lg max-w-2xl mx-auto">
            Our jewelry is made by the finest artists and carefully selected to reflect your style and personality
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendProducts;
