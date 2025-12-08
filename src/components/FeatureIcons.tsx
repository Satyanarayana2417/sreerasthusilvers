import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Truck, Headphones, CalendarCheck, Gift } from "lucide-react";

const features = [
  {
    id: 1,
    title: "Complimentary Shipping",
    description: "We offer complimentary shipping and returns on all orders over $130.",
    icon: Truck,
  },
  {
    id: 2,
    title: "Olight At Your Service",
    description: "Our client care experts are always here to help.",
    icon: Headphones,
  },
  {
    id: 3,
    title: "Book an Appointment",
    description: "We're happy to help with in-store or virtual appointments.",
    icon: CalendarCheck,
  },
  {
    id: 4,
    title: "The Iconic Blue Box",
    description: "Your Olight purchase comes wrapped in our Blue Box packaging.",
    icon: Gift,
  },
];

const FeatureIcons = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="section-padding bg-secondary/30">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-background shadow-luxury-md transition-all group-hover:shadow-gold group-hover:scale-110">
                <feature.icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <h4 className="font-heading text-lg font-medium mb-2">
                {feature.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureIcons;
