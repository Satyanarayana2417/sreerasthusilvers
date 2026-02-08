import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Heart, ShoppingBag, User, ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo-new.png";
import ring4 from "@/assets/products/ring-4.jpg";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { getAllProducts, Product } from "@/services/productService";
import { UIProduct, adaptFirebaseToUI } from "@/lib/productAdapter";
import MobileHeader from "./MobileHeader";

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
      { name: "Silver Sofa Collection", href: "/furniture/silver-sofa-collection" },
      { name: "Royal Silver Chairs", href: "/furniture/royal-silver-chairs" },
      { name: "Royal Silver Tables", href: "/furniture/royal-silver-tables" },
      { name: "Antique Silver Décor", href: "/furniture/antique-silver-decor" },
      { name: "Silver Swing (Jhoola)", href: "/furniture/silver-swing-jhoola" },
    ],
  },
  productLayouts: {
    title: "Articles",
    items: [
      { name: "Silver Pooja Kalash Set", href: "/articles/silver-pooja-kalash-set" },
      { name: "Silver Coconut", href: "/articles/silver-coconut" },
      { name: "Silver Footwear", href: "/articles/silver-footwear" },
      { name: "Silver Gopuram Idol Stand", href: "/articles/silver-gopuram-idol-stand" },
      { name: "Silver Camel Cart", href: "/articles/silver-camel-cart" },
      { name: "Silver Jhula", href: "/articles/silver-jhula" },
    ],
  },
  productType: {
    title: "Other Products",
    items: [
      { name: "Silver Idols", href: "/products/silver-idols" },
      { name: "Silver Pooja Items", href: "/products/silver-pooja-items" },
      { name: "Silver Gift Articles", href: "/products/silver-gift-articles" },
      { name: "Custom Engraved Items", href: "/products/custom-engraved-items" },
      { name: "Silver Coins", href: "/products/silver-coins" },
      { name: "Limited Edition Pieces", href: "/products/limited-edition-pieces" },
    ],
  },
  featured: {
    eyebrow: "FAVORITE ITEMS",
    title: "Unique Engagement Rings",
    cta: "Shop Now",
    image: ring4,
  },
};

// Categories mega menu data
const categoriesMenuData = {
  bracelets: {
    title: "Bracelets",
    items: [
      { name: "Diamond Bracelets", href: "/categories/bracelets/diamond" },
      { name: "Gemstone Bracelets", href: "/categories/bracelets/gemstone" },
      { name: "Pearl Bracelets", href: "/categories/bracelets/pearl" },
      { name: "Gold Bracelets", href: "/categories/bracelets/gold" },
      { name: "Silver Bracelets", href: "/categories/bracelets/silver" },
      { name: "Bangle Bracelets", href: "/categories/bracelets/bangle" },
    ],
  },
  necklaces: {
    title: "Necklaces",
    items: [
      { name: "Diamond Necklaces", href: "/categories/necklaces/diamond" },
      { name: "Gemstone Necklaces", href: "/categories/necklaces/gemstone" },
      { name: "Pearl Necklaces", href: "/categories/necklaces/pearl" },
      { name: "Gold Necklaces", href: "/categories/necklaces/gold" },
      { name: "Silver Necklaces", href: "/categories/necklaces/silver" },
      { name: "Cross Necklaces", href: "/categories/necklaces/cross" },
    ],
  },
  rings: {
    title: "Rings",
    items: [
      { name: "Diamond Rings", href: "/categories/rings/diamond" },
      { name: "Gemstone Rings", href: "/categories/rings/gemstone" },
      { name: "Wedding Rings", href: "/categories/rings/wedding" },
      { name: "Engagement Rings", href: "/categories/rings/engagement" },
      { name: "Gold Rings", href: "/categories/rings/gold" },
      { name: "Fashion Rings", href: "/categories/rings/fashion" },
    ],
  },
  jewelry: {
    title: "Jewelry",
    items: [
      { name: "Men's Jewelry", href: "/categories/jewelry/mens" },
      { name: "Birthstone Jewelry", href: "/categories/jewelry/birthstone" },
      { name: "Pearl Jewelry", href: "/categories/jewelry/pearl" },
      { name: "Rose Gold Jewelry", href: "/categories/jewelry/rose-gold" },
      { name: "New Arrivals", href: "/categories/jewelry/new-arrivals" },
      { name: "Jewelry Sale", href: "/categories/jewelry/sale" },
    ],
  },
  featured: {
    eyebrow: "LUXURY NECKLACE",
    title: "Best Friend Jewelry",
    cta: "Shop Now",
    image: ring4,
  },
};

// Pages menu data
const pagesMenuData = [
  { name: "About Us", href: "/about", highlight: false },
  { name: "FAQ", href: "/faq", highlight: true },
  { name: "My account", href: "/profile", highlight: false },
  { name: "Cart", href: "/cart", highlight: false },
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile } = useAuth();
  const { toggleCart, totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [mobileShopCategory, setMobileShopCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UIProduct[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allProducts, setAllProducts] = useState<UIProduct[]>([]);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Check if current page is an auth page
  const isAuthPage = location.pathname.startsWith('/login') || 
                     location.pathname.startsWith('/signup') || 
                     location.pathname.startsWith('/forgot-password') ||
                     location.pathname.startsWith('/admin');

  // Load all products for search
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await getAllProducts();
        const uiProducts = products.map(p => adaptFirebaseToUI(p as any));
        setAllProducts(uiProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };
    loadProducts();
  }, []);

  // Handle click outside search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allProducts.filter(product => 
      product.title.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    ).slice(0, 8); // Limit to 8 results

    setSearchResults(filtered);
    setShowSearchResults(true);
  }, [searchQuery, allProducts]);

  // Handle scroll
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setIsScrolled(window.scrollY > 50);
    });
  }

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Categories", href: "#", hasDropdown: true },
    { name: "Pages", href: "#", hasDropdown: true },
    { name: "Blog", href: "#", hasDropdown: true },
    { name: "Contact", href: "/contact" },
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
      {/* Mobile Header - Only on Mobile, hidden on auth pages */}
      {!isAuthPage && <MobileHeader />}

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
        className={`hidden lg:block sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-lg"
            : "bg-background"
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between gap-4 h-16 lg:h-20">
            {/* Logo */}
            <a href="/" className="flex items-center flex-shrink-0">
              <img src={logo} alt="Sreerasthu Silvers" className="h-7 md:h-9 lg:h-10 w-auto" />
            </a>

            {/* Search Bar - Desktop & Mobile */}
            <div className="flex-1 max-w-2xl mx-4" ref={searchRef}>
              <div className="relative">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search for Products, Brands and More"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery && setShowSearchResults(true)}
                    className="w-full pl-4 pr-12 py-2.5 bg-blue-50 text-sm rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  <button className="absolute right-3 p-1.5 hover:bg-blue-100 rounded-md transition-colors">
                    <Search className="w-5 h-5 text-blue-600" />
                  </button>
                </div>

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {showSearchResults && searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-[400px] overflow-y-auto z-50"
                    >
                      <div className="p-2">
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => {
                              navigate(`/product/${product.id}`);
                              setSearchQuery("");
                              setShowSearchResults(false);
                            }}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg w-full text-left transition-colors"
                          >
                            <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ShoppingBag className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {product.title}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {product.category}
                              </p>
                              <p className="text-sm font-semibold text-blue-600 mt-0.5">
                                ₹{product.price.toLocaleString()}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                      {searchResults.length === 8 && (
                        <div className="border-t border-gray-200 p-3 text-center">
                          <button
                            onClick={() => {
                              // Navigate to search results page if you have one
                              setShowSearchResults(false);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            View all results for "{searchQuery}"
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* No Results Message */}
                <AnimatePresence>
                  {showSearchResults && searchQuery && searchResults.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 z-50"
                    >
                      <div className="p-6 text-center">
                        <p className="text-gray-600">No products found for "{searchQuery}"</p>
                        <p className="text-sm text-gray-400 mt-1">Try searching with different keywords</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 lg:gap-3 flex-shrink-0">
              {/* User Profile */}
              <button 
                onClick={() => navigate(user ? "/account" : "/account")}
                className="flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors group"
                aria-label="Account"
              >
                <User className="w-5 h-5 text-gray-700 group-hover:text-blue-600" />
                <span className="hidden lg:block text-sm font-medium text-gray-700 group-hover:text-blue-600">
                  {user ? userProfile?.username || 'Account' : 'Login'}
                </span>
              </button>

              {/* Wishlist - Hidden on small mobile */}
              <button 
                onClick={() => navigate("/wishlist")}
                className="hidden sm:flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors group"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 text-gray-700 group-hover:text-blue-600" />
                <span className="hidden lg:block text-sm font-medium text-gray-700 group-hover:text-blue-600">
                  Wishlist
                </span>
              </button>

              {/* Cart */}
              <button 
                onClick={toggleCart}
                className="flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors relative group" 
                aria-label="Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-gray-700 group-hover:text-blue-600" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="hidden lg:block text-sm font-medium text-gray-700 group-hover:text-blue-600">
                  Cart
                </span>
              </button>

              {/* Hamburger Menu Button - Always Visible */}
              <button
                className="p-2 hover:bg-blue-50 rounded-lg transition-colors ml-1"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
              </button>
            </div>
          </div>
        </div>

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

        {/* Categories Mega Menu Dropdown */}
        <AnimatePresence>
          {activeDropdown === "Categories" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-full bg-background border-t border-border shadow-luxury-lg z-50"
              onMouseEnter={() => handleMouseEnter("Categories")}
              onMouseLeave={handleMouseLeave}
            >
              <div className="container-custom py-8">
                <div className="grid grid-cols-5 gap-8">
                  {/* Bracelets */}
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {categoriesMenuData.bracelets.title}
                    </h3>
                    <ul className="space-y-2">
                      {categoriesMenuData.bracelets.items.map((subItem) => (
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

                  {/* Necklaces */}
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {categoriesMenuData.necklaces.title}
                    </h3>
                    <ul className="space-y-2">
                      {categoriesMenuData.necklaces.items.map((subItem) => (
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

                  {/* Rings */}
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {categoriesMenuData.rings.title}
                    </h3>
                    <ul className="space-y-2">
                      {categoriesMenuData.rings.items.map((subItem) => (
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

                  {/* Jewelry */}
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {categoriesMenuData.jewelry.title}
                    </h3>
                    <ul className="space-y-2">
                      {categoriesMenuData.jewelry.items.map((subItem) => (
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
                  <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
                    <img
                      src={categoriesMenuData.featured.image}
                      alt={categoriesMenuData.featured.title}
                      className="absolute right-0 bottom-0 w-3/4 h-auto object-contain"
                    />
                    <div className="relative z-10 p-6">
                      <span className="text-xs uppercase tracking-wider text-primary font-medium">
                        {categoriesMenuData.featured.eyebrow}
                      </span>
                      <h3 className="text-2xl font-semibold text-foreground mt-2 mb-4 leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {categoriesMenuData.featured.title}
                      </h3>
                      <a
                        href="#"
                        className="inline-block px-5 py-2.5 bg-foreground text-background text-sm font-medium rounded-full hover:bg-foreground/90 transition-colors"
                      >
                        {categoriesMenuData.featured.cta}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pages Dropdown Menu */}
        <AnimatePresence>
          {activeDropdown === "Pages" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-background border border-border rounded-2xl shadow-luxury-lg z-50 min-w-[200px] overflow-hidden"
              onMouseEnter={() => handleMouseEnter("Pages")}
              onMouseLeave={handleMouseLeave}
            >
              <div className="py-3">
                <ul>
                  {pagesMenuData.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={`block px-6 py-2.5 text-base transition-colors ${
                          item.highlight
                            ? "text-primary font-medium hover:bg-primary/5"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hamburger Menu - Works on All Screen Sizes */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-background border-t border-border overflow-hidden"
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
