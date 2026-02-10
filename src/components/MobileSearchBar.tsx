import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mic, ShoppingBag, MicOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "@/services/productService";
import { UIProduct, adaptFirebaseToUI } from "@/lib/productAdapter";

// Extend Window interface for Speech Recognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: Event) => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const MobileSearchBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UIProduct[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allProducts, setAllProducts] = useState<UIProduct[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasSpokenRef = useRef(false);

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

  // Clear silence timeout helper
  const clearSilenceTimeout = useCallback(() => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  }, []);

  // Start silence timeout - stops listening after user stops speaking
  const startSilenceTimeout = useCallback(() => {
    clearSilenceTimeout();
    silenceTimeoutRef.current = setTimeout(() => {
      if (recognitionRef.current && hasSpokenRef.current) {
        recognitionRef.current.stop();
      }
    }, 1500); // Stop after 1.5 seconds of silence
  }, [clearSilenceTimeout]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognitionAPI) {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false; // Changed to false for auto-stop behavior
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Indian English for better recognition
      
      recognition.onstart = () => {
        setIsListening(true);
        hasSpokenRef.current = false;
      };
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let fullTranscript = '';
        
        // Get the complete transcript from all results
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript;
        }
        
        // Mark that user has spoken
        if (fullTranscript) {
          hasSpokenRef.current = true;
        }
        
        // Update search with the full transcript (replaces, not appends)
        if (fullTranscript) {
          setSearchQuery(fullTranscript.trim());
          
          // Reset silence timeout on each result
          startSilenceTimeout();
        }
      };
      
      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
        clearSilenceTimeout();
        hasSpokenRef.current = false;
      };
      
      recognition.onerror = (event: Event) => {
        console.error('Speech recognition error:', event);
        setIsListening(false);
        setInterimTranscript('');
        clearSilenceTimeout();
        hasSpokenRef.current = false;
      };
      
      recognitionRef.current = recognition;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      clearSilenceTimeout();
    };
  }, [startSilenceTimeout, clearSilenceTimeout]);

  // Toggle voice recognition
  const toggleVoiceSearch = useCallback(() => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      clearSilenceTimeout();
    } else {
      setSearchQuery(''); // Clear previous search when starting new voice search
      setInterimTranscript('');
      hasSpokenRef.current = false;
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  }, [isListening, clearSilenceTimeout]);

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

  // Search functionality - works with even single letters
  useEffect(() => {
    const queryToSearch = searchQuery.trim();
    
    if (queryToSearch.length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const query = queryToSearch.toLowerCase();
    
    // Filter products - match from beginning of words for single letters
    const filtered = allProducts.filter(product => {
      const title = product.title.toLowerCase();
      const category = product.category?.toLowerCase() || '';
      
      // For single character searches, match words starting with that letter
      if (query.length === 1) {
        const titleWords = title.split(/\s+/);
        const categoryWords = category.split(/\s+/);
        return titleWords.some(word => word.startsWith(query)) ||
               categoryWords.some(word => word.startsWith(query)) ||
               title.startsWith(query);
      }
      
      // For longer queries, use includes
      return title.includes(query) || category.includes(query);
    }).slice(0, 10);

    setSearchResults(filtered);
    setShowSearchResults(true);
  }, [searchQuery, allProducts]);

  return (
    <div className="lg:hidden sticky top-0 z-40 bg-white px-4 py-2 shadow-sm" ref={searchRef}>
      <div className="relative">
        <div className={`relative flex items-center bg-white rounded-lg overflow-hidden border ${isListening ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'}`}>
          <Search className="absolute left-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={isListening ? "Listening..." : "Search any Product.."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery && setShowSearchResults(true)}
            className="w-full pl-10 pr-12 py-2.5 text-sm text-gray-700 placeholder-gray-400 bg-white focus:outline-none"
          />
          <button 
            onClick={toggleVoiceSearch}
            className={`absolute right-3 p-1 rounded-md transition-colors ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'hover:bg-gray-200'
            }`}
          >
            {isListening ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Mic className="w-5 h-5 text-white" />
              </motion.div>
            ) : (
              <Mic className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>

        {/* Voice Listening Indicator */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full left-0 right-0 mt-1 flex items-center justify-center gap-2 py-2 bg-red-50 rounded-lg border border-red-200"
            >
              <div className="flex gap-1">
                <motion.div
                  animate={{ scaleY: [1, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 0.5, delay: 0 }}
                  className="w-1 h-4 bg-red-500 rounded-full"
                />
                <motion.div
                  animate={{ scaleY: [1, 2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
                  className="w-1 h-4 bg-red-500 rounded-full"
                />
                <motion.div
                  animate={{ scaleY: [1, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
                  className="w-1 h-4 bg-red-500 rounded-full"
                />
                <motion.div
                  animate={{ scaleY: [1, 2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.5, delay: 0.3 }}
                  className="w-1 h-4 bg-red-500 rounded-full"
                />
              </div>
              <span className="text-xs text-red-600 font-medium">Speak now...</span>
            </motion.div>
          )}
        </AnimatePresence>

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
