import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Heart, ShoppingBag, User, ChevronDown, ChevronRight } from "lucide-react";
import logo from "../assets/logo-new.png";
import ring4 from "@/assets/products/ring-4.jpg";

// Shop mega menu data
const shopMenuData = {
  shopLayouts: {
    title: "Jewellery",
    items: [
      { name: "Necklaces", href: "/shop/necklaces" },
      { name: "Rings", href: "/shop/rings" },
      { name: "Bracelets", href: "/shop/bracelets" },
      { name: "Anklets", href: "/shop/anklets" },
      { name: "Pendants", href: "/shop/pendants" },
      { name: "Earrings", href: "/shop/earrings" },
    ],
  },
  filterStyle: {
    title: "Furniture",
    items: [
      { name: "Silver Sofa Collection", href: "/shop/sofa" },
      { name: "Royal Silver Chairs", href: "/shop/chairs" },
      { name: "Royal Silver Tables", href: "/shop/tables" },
      { name: "Antique Silver Décor", href: "/shop/decor" },
      { name: "Silver Swing (Jhoola)", href: "/shop/swing" },
    ],
  },
  productLayouts: {
    title: "Articles",
    items: [
      { name: "Silver Pooja Kalash Set", href: "/shop/pooja-kalash" },
      { name: "Silver Coconut", href: "/shop/coconut" },
      { name: "Silver Footwear", href: "/shop/footwear" },
      { name: "Silver Gopuram Idol Stand", href: "/shop/idol-stand" },
      { name: "Silver Camel Cart", href: "/shop/camel-cart" },
      { name: "Silver Jhula", href: "/shop/jhula" },
    ],
  },
  productType: {
    title: "Other Products",
    items: [
      { name: "Silver Idols", href: "/shop/idols" },
      { name: "Silver Pooja Items", href: "/shop/pooja-items" },
      { name: "Silver Gift Articles", href: "/shop/gift-articles" },
      { name: "Custom Engraved Items", href: "/shop/custom-engraved" },
      { name: "Silver Coins", href: "/shop/coins" },
      { name: "Limited Edition Pieces", href: "/shop/limited-edition" },
    ],
  },
  featured: {
    eyebrow: "FAVORITE ITEMS",
    title: "Unique Engagement Rings",
    cta: "Shop Now",
    image: ring4,
  },
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [mobileShopCategory, setMobileShopCategory] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle scroll
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setIsScrolled(window.scrollY > 50);
    });
  }

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "#", hasDropdown: true, megaMenu: true },
    { name: "Categories", href: "#", hasDropdown: true },
    { name: "Pages", href: "#", hasDropdown: true },
    { name: "Blog", href: "#", hasDropdown: true },
    { name: "Contact", href: "#" },
  ];

  const handleMouseEnter = (itemName: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(itemName);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <>
      {/* Announcement Bar - Hidden on mobile */}
      <div className="hidden md:block bg-foreground overflow-hidden w-full max-w-[100vw]">
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
              <img src={logo} alt="Sreerasthu Silvers" className="h-10 md:h-12 w-auto" />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.hasDropdown && handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <a
                    href={item.href}
                    className={`group flex items-center gap-1 text-sm font-medium tracking-wide transition-colors link-underline ${
                      activeDropdown === item.name ? "text-primary" : "text-foreground/80 hover:text-foreground"
                    }`}
                  >
                    {item.name}
                    {item.hasDropdown && (
                      <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === item.name ? "rotate-180" : ""}`} />
                    )}
                  </a>
                </div>
              ))}
            </nav>

            {/* Shop Mega Menu Dropdown */}
            <AnimatePresence>
              {activeDropdown === "Shop" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 right-0 top-full bg-background border-t border-border shadow-luxury-lg z-50"
                  onMouseEnter={() => handleMouseEnter("Shop")}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="container-custom py-8">
                    <div className="grid grid-cols-5 gap-8">
                      {/* Shop Layouts */}
                      <div>
                        <h3 className="text-base font-semibold text-foreground mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {shopMenuData.shopLayouts.title}
                        </h3>
                        <ul className="space-y-2">
                          {shopMenuData.shopLayouts.items.map((subItem) => (
                            <li key={subItem.name}>
                              <a
                                href={subItem.href}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                              >
                                {subItem.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Filter Style */}
                      <div>
                        <h3 className="text-base font-semibold text-foreground mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {shopMenuData.filterStyle.title}
                        </h3>
                        <ul className="space-y-2">
                          {shopMenuData.filterStyle.items.map((subItem) => (
                            <li key={subItem.name}>
                              <a
                                href={subItem.href}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                              >
                                {subItem.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Product Layouts */}
                      <div>
                        <h3 className="text-base font-semibold text-foreground mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {shopMenuData.productLayouts.title}
                        </h3>
                        <ul className="space-y-2">
                          {shopMenuData.productLayouts.items.map((subItem) => (
                            <li key={subItem.name}>
                              <a
                                href={subItem.href}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                              >
                                {subItem.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Product Type */}
                      <div>
                        <h3 className="text-base font-semibold text-foreground mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {shopMenuData.productType.title}
                        </h3>
                        <ul className="space-y-2">
                          {shopMenuData.productType.items.map((subItem) => (
                            <li key={subItem.name}>
                              <a
                                href={subItem.href}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                              >
                                {subItem.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Featured Banner */}
                      <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-cream to-secondary">
                        <img
                          src={shopMenuData.featured.image}
                          alt={shopMenuData.featured.title}
                          className="absolute right-0 bottom-0 w-3/4 h-auto object-contain"
                        />
                        <div className="relative z-10 p-6">
                          <span className="text-xs uppercase tracking-wider text-primary font-medium">
                            {shopMenuData.featured.eyebrow}
                          </span>
                          <h3 className="text-2xl font-semibold text-foreground mt-2 mb-4 leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {shopMenuData.featured.title}
                          </h3>
                          <a
                            href="#"
                            className="inline-block px-5 py-2.5 bg-foreground text-background text-sm font-medium rounded-full hover:bg-foreground/90 transition-colors"
                          >
                            {shopMenuData.featured.cta}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
              className="lg:hidden bg-background border-t border-border overflow-hidden"
            >
              <nav className="container-custom py-6">
                <ul className="space-y-1">
                  {navItems.map((item, index) => (
                    <motion.li
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {item.name === "Shop" ? (
                        // Shop with expandable submenu
                        <div>
                          <button
                            onClick={() => setMobileShopOpen(!mobileShopOpen)}
                            className="flex items-center justify-between py-3 w-full text-lg font-medium"
                          >
                            <span>{item.name}</span>
                            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileShopOpen ? "rotate-180" : ""}`} />
                          </button>
                          
                          {/* Shop Categories */}
                          <AnimatePresence>
                            {mobileShopOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-4 pb-2 space-y-1">
                                  {/* Jewellery */}
                                  <div>
                                    <button
                                      onClick={() => setMobileShopCategory(mobileShopCategory === "jewellery" ? null : "jewellery")}
                                      className="flex items-center justify-between py-2.5 w-full text-base font-medium text-foreground/80"
                                    >
                                      <span>{shopMenuData.shopLayouts.title}</span>
                                      <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${mobileShopCategory === "jewellery" ? "rotate-90" : ""}`} />
                                    </button>
                                    <AnimatePresence>
                                      {mobileShopCategory === "jewellery" && (
                                        <motion.ul
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: "auto" }}
                                          exit={{ opacity: 0, height: 0 }}
                                          className="pl-4 space-y-1 overflow-hidden"
                                        >
                                          {shopMenuData.shopLayouts.items.map((subItem) => (
                                            <li key={subItem.name}>
                                              <a
                                                href={subItem.href}
                                                className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                              >
                                                {subItem.name}
                                              </a>
                                            </li>
                                          ))}
                                        </motion.ul>
                                      )}
                                    </AnimatePresence>
                                  </div>

                                  {/* Furniture */}
                                  <div>
                                    <button
                                      onClick={() => setMobileShopCategory(mobileShopCategory === "furniture" ? null : "furniture")}
                                      className="flex items-center justify-between py-2.5 w-full text-base font-medium text-foreground/80"
                                    >
                                      <span>{shopMenuData.filterStyle.title}</span>
                                      <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${mobileShopCategory === "furniture" ? "rotate-90" : ""}`} />
                                    </button>
                                    <AnimatePresence>
                                      {mobileShopCategory === "furniture" && (
                                        <motion.ul
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: "auto" }}
                                          exit={{ opacity: 0, height: 0 }}
                                          className="pl-4 space-y-1 overflow-hidden"
                                        >
                                          {shopMenuData.filterStyle.items.map((subItem) => (
                                            <li key={subItem.name}>
                                              <a
                                                href={subItem.href}
                                                className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                              >
                                                {subItem.name}
                                              </a>
                                            </li>
                                          ))}
                                        </motion.ul>
                                      )}
                                    </AnimatePresence>
                                  </div>

                                  {/* Articles */}
                                  <div>
                                    <button
                                      onClick={() => setMobileShopCategory(mobileShopCategory === "articles" ? null : "articles")}
                                      className="flex items-center justify-between py-2.5 w-full text-base font-medium text-foreground/80"
                                    >
                                      <span>{shopMenuData.productLayouts.title}</span>
                                      <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${mobileShopCategory === "articles" ? "rotate-90" : ""}`} />
                                    </button>
                                    <AnimatePresence>
                                      {mobileShopCategory === "articles" && (
                                        <motion.ul
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: "auto" }}
                                          exit={{ opacity: 0, height: 0 }}
                                          className="pl-4 space-y-1 overflow-hidden"
                                        >
                                          {shopMenuData.productLayouts.items.map((subItem) => (
                                            <li key={subItem.name}>
                                              <a
                                                href={subItem.href}
                                                className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                              >
                                                {subItem.name}
                                              </a>
                                            </li>
                                          ))}
                                        </motion.ul>
                                      )}
                                    </AnimatePresence>
                                  </div>

                                  {/* Other Products */}
                                  <div>
                                    <button
                                      onClick={() => setMobileShopCategory(mobileShopCategory === "other" ? null : "other")}
                                      className="flex items-center justify-between py-2.5 w-full text-base font-medium text-foreground/80"
                                    >
                                      <span>{shopMenuData.productType.title}</span>
                                      <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${mobileShopCategory === "other" ? "rotate-90" : ""}`} />
                                    </button>
                                    <AnimatePresence>
                                      {mobileShopCategory === "other" && (
                                        <motion.ul
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: "auto" }}
                                          exit={{ opacity: 0, height: 0 }}
                                          className="pl-4 space-y-1 overflow-hidden"
                                        >
                                          {shopMenuData.productType.items.map((subItem) => (
                                            <li key={subItem.name}>
                                              <a
                                                href={subItem.href}
                                                className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                              >
                                                {subItem.name}
                                              </a>
                                            </li>
                                          ))}
                                        </motion.ul>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        // Regular nav item
                        <a
                          href={item.href}
                          className="flex items-center justify-between py-3 text-lg font-medium"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                          {item.hasDropdown && <ChevronDown className="w-5 h-5" />}
                        </a>
                      )}
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
