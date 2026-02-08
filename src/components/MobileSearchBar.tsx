import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mic, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "@/services/productService";
import { UIProduct, adaptFirebaseToUI } from "@/lib/productAdapter";

const MobileSearchBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UIProduct[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allProducts, setAllProducts] = useState<UIProduct[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

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
      product.category?.toLowerCase().includes(query)
    ).slice(0, 8);

    setSearchResults(filtered);
    setShowSearchResults(true);
  }, [searchQuery, allProducts]);

  return (
    <div className="lg:hidden sticky top-0 z-40 bg-white px-4 py-2 shadow-sm" ref={searchRef}>
      <div className="relative">
        <div className="relative flex items-center bg-white rounded-lg overflow-hidden border border-gray-300">
          <Search className="absolute left-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search any Product.."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery && setShowSearchResults(true)}
            className="w-full pl-10 pr-12 py-2.5 text-sm text-gray-700 placeholder-gray-400 bg-white focus:outline-none"
          />
          <button className="absolute right-3 p-1 hover:bg-gray-200 rounded-md transition-colors">
            <Mic className="w-5 h-5 text-gray-400" />
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
  );
};

export default MobileSearchBar;
