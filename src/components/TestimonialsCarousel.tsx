import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import avatar1 from "@/assets/avatars/avatar-1.jpg";
import avatar2 from "@/assets/avatars/avatar-2.jpg";
import avatar3 from "@/assets/avatars/avatar-3.jpg";

const testimonials = [
  {
    id: 1,
    title: "Charming Golden Jewellery",
    quote: "Consectetur adipiscing elit. Integer nunc viverra laoreet est the is porta pretium metus aliquam eget maecenas porta is nunc viverra Aenean pulvinar maximus",
    author: "Saanvi Iyer",
    role: "Fresh Design",
    avatar: avatar1,
    rating: 5,
  },
  {
    id: 2,
    title: "Golden Bracelets",
    quote: "Montluc claim to offer the finest diamond jewellery. I did my research, compared specifications with some of the big brands and now I will never walk into a store again.",
    author: "Ananya Bansal",
    role: "Fresh Design",
    avatar: avatar2,
    rating: 5,
  },
  {
    id: 3,
    title: "Charming Golden Jewellery",
    quote: "I did my research, compared with some of the big brands and now Aenean pulvinar maximus. Montluc claim to offer the finest diamond jewellery you can buy direct from the maker.",
    author: "Diya Nair",
    role: "Fresh Design",
    avatar: avatar3,
    rating: 5,
  },
];

const TestimonialsCarousel = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section ref={ref} className="py-16 md:py-20 bg-white">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            What Our Clients Say
          </h2>
          <p className="text-base text-muted-foreground">
            Adorn Yourself in Glamour: Find Your Perfect Piece Today
          </p>
        </motion.div>

        {/* Testimonials Grid - Desktop */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-md border border-border/30"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? "fill-orange-400 text-orange-400"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>

              {/* Title */}
              <h4 className="text-lg font-semibold mb-4 text-foreground">
                " {testimonial.title} "
              </h4>

              {/* Quote */}
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {testimonial.quote}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm text-foreground">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Carousel - Mobile */}
        <div className="lg:hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-md border border-border/30"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />
                ))}
              </div>
              <h4 className="text-lg font-semibold mb-3 text-foreground">
                " {testimonials[currentIndex].title} "
              </h4>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                {testimonials[currentIndex].quote}
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonials[currentIndex].avatar}
                  alt={testimonials[currentIndex].author}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm text-foreground">{testimonials[currentIndex].author}</p>
                  <p className="text-xs text-muted-foreground">{testimonials[currentIndex].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Mobile Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIndex ? "bg-primary w-6" : "bg-muted-foreground/30"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
