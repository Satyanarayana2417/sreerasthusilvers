import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Heart, ShoppingBag, User, ChevronDown } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setIsScrolled(window.scrollY > 50);
    });
  }

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "#", hasDropdown: true },
    { name: "Categories", href: "#", hasDropdown: true },
    { name: "Pages", href: "#", hasDropdown: true },
    { name: "Blog", href: "#", hasDropdown: true },
    { name: "Contact", href: "#" },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-foreground overflow-hidden">
        <div className="marquee flex whitespace-nowrap py-2">
          <span className="inline-flex items-center gap-8 text-xs tracking-wider text-primary-foreground px-4">
            <span>UP TO 30% OFF EVERYTHING</span>
            <span className="text-primary">✦</span>
            <span>REGISTER TO ENJOY 10% OFF YOUR FIRST ONLINE ORDER</span>
            <span className="text-primary">✦</span>
            <span>FREE DELIVERY FOR NEXT 3 ORDERS</span>
            <span className="text-primary">✦</span>
            <span>20% OFF MOST LOVELED - NEW LINE</span>
            <span className="text-primary">✦</span>
            <span>UP TO 30% OFF EVERYTHING</span>
            <span className="text-primary">✦</span>
            <span>REGISTER TO ENJOY 10% OFF YOUR FIRST ONLINE ORDER</span>
            <span className="text-primary">✦</span>
            <span>FREE DELIVERY FOR NEXT 3 ORDERS</span>
            <span className="text-primary">✦</span>
            <span>20% OFF MOST LOVELED - NEW LINE</span>
          </span>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-luxury-sm"
            : "bg-background"
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="/" className="flex items-center">
              <span className="text-2xl font-heading font-semibold tracking-tight">
                OLIGHT
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group flex items-center gap-1 text-sm font-medium tracking-wide text-foreground/80 hover:text-foreground transition-colors link-underline"
                >
                  {item.name}
                  {item.hasDropdown && (
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  )}
                </a>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-muted rounded-full transition-colors focus-gold" aria-label="Search">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-muted rounded-full transition-colors focus-gold hidden sm:flex" aria-label="Account">
                <User className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-muted rounded-full transition-colors focus-gold hidden sm:flex" aria-label="Wishlist">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-muted rounded-full transition-colors focus-gold relative" aria-label="Cart">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                  0
                </span>
              </button>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 hover:bg-muted rounded-full transition-colors focus-gold"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-background border-t border-border"
            >
              <nav className="container-custom py-6">
                <ul className="space-y-4">
                  {navItems.map((item, index) => (
                    <motion.li
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <a
                        href={item.href}
                        className="flex items-center justify-between py-2 text-lg font-medium"
                      >
                        {item.name}
                        {item.hasDropdown && <ChevronDown className="w-5 h-5" />}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;
