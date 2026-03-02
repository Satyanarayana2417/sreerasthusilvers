import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Heart, ShoppingBag, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo-new.png";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { getAllProducts, Product } from "@/services/productService";
import { UIProduct, adaptFirebaseToUI } from "@/lib/productAdapter";
import MobileHeader from "./MobileHeader";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile } = useAuth();
  const { totalItems, toggleCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UIProduct[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allProducts, setAllProducts] = useState<UIProduct[]>([]);
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
    { name: "Contact", href: "/contact" },
  ];

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
                {user ? (
                  user.photoURL || userProfile?.avatar ? (
                    <img 
                      key={user.photoURL || userProfile?.avatar}
                      src={user.photoURL || userProfile?.avatar} 
                      alt="Profile" 
                      className="w-6 h-6 rounded-full object-cover border border-black"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border border-black">
                      <span className="text-white font-semibold text-xs">
                        {(userProfile?.name || userProfile?.username || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )
                ) : (
                  <User className="w-5 h-5 text-gray-700 group-hover:text-blue-600" />
                )}
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

        {/* Hamburger Menu - Works on All Screen Sizes */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-4 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[180px] overflow-hidden"
            >
              <nav className="py-2">
                <a
                  href="/contact"
                  className="block px-4 py-3 text-base font-medium text-foreground hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;
