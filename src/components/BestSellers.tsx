import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ProductCard from "./ProductCard";
import ring1 from "@/assets/products/ring-1.jpg";
import earrings1 from "@/assets/products/earrings-1.jpg";
import watch1 from "@/assets/products/watch-1.jpg";
import necklace1 from "@/assets/products/necklace-1.jpg";
import ring2 from "@/assets/products/ring-2.jpg";

const products = [
  {
    id: "p-001",
    title: "14k Gold Bespoke Signet Ring",
    category: "Rings",
    price: 922.56,
    oldPrice: 509.22,
    rating: 4.9,
    reviews: 5,
    image: ring1,
    alt: "14k gold signet ring",
  },
  {
    id: "p-002",
    title: "Faded Grandeur Stud Earrings",
    category: "Accessories, Pearls",
    price: 93.30,
    oldPrice: null,
    rating: 4.8,
    reviews: 5,
    image: earrings1,
    alt: "Elegant stud earrings",
  },
  {
    id: "p-003",
    title: "Awesome Wooden Watch",
    category: "Earrings",
    price: 729.94,
    oldPrice: null,
    rating: 4.7,
    reviews: 5,
    image: watch1,
    alt: "Luxury wooden watch",
  },
  {
    id: "p-004",
    title: "Gorgeous Aluminum Necklace",
    category: "Earrings",
    price: 556.96,
    oldPrice: null,
    rating: 4.9,
    reviews: 5,
    image: necklace1,
    alt: "Gorgeous necklace",
  },
  {
    id: "p-005",
    title: "Diamond Lou Helium Ring",
    category: "Pearls",
    price: 223.99,
    oldPrice: null,
    rating: 4.8,
    reviews: 5,
    image: ring2,
    alt: "Diamond helium ring",
  },
];

const BestSellers = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="section-padding bg-secondary/50">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-lg mb-4">Our Best Sellers</h2>
          <p className="body-lg max-w-2xl mx-auto">
            Our jewelry is made by the finest artists and carefully selected to reflect your style and personality.
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

export default BestSellers;
