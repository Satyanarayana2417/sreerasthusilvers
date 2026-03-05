import { Search, Camera, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const MobileSearchBar = () => {
  const navigate = useNavigate();
  
  const categories = [
    "silver jewellery",
    "rings",
    "necklaces",
    "earrings",
    "bracelets",
    "pendants",
    "chains",
    "anklets",
    "silver coins",
    "gift articles"
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);

  const handleVoiceSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice search is not supported in your browser');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      navigate(`/search?q=${encodeURIComponent(transcript)}`);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }, 2500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="lg:hidden bg-white px-4 pt-1 pb-2 z-40">
      <div className="w-full relative flex items-center bg-white rounded-lg overflow-hidden border border-gray-200 h-[52px]">
        {/* Search Icon */}
        <button 
          onClick={() => navigate("/search")}
          className="pl-4 pr-2 flex items-center h-full flex-1"
        >
          <Search className="w-[22px] h-[22px]" strokeWidth={1} style={{ color: '#832729' }} />
        
          {/* Placeholder Text */}
          <div className="flex-1 text-[14px] text-gray-400 text-left flex items-center overflow-hidden ml-2">
            <span className="mr-1 whitespace-nowrap">Search for</span>
            <div className="relative min-w-[120px] h-[20px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentIndex}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute left-0 top-0 whitespace-nowrap"
                >
                  {categories[currentIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </button>
        
        {/* Right Icons: Camera + Mic */}
        <div className="flex items-center gap-0 pr-3">
          <button className="p-1 hover:bg-gray-50 rounded-full transition-colors">
            <Camera className="w-[22px] h-[22px]" strokeWidth={1} style={{ color: '#832729' }} />
          </button>
          <div className="w-px h-5 bg-gray-300" />
          <button 
            onClick={handleVoiceSearch}
            className={`p-1 hover:bg-gray-50 rounded-full transition-colors ${
              isListening ? 'bg-red-50' : ''
            }`}
          >
            <Mic className="w-[22px] h-[22px]" strokeWidth={1} style={{ color: isListening ? '#EF4444' : '#832729' }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileSearchBar;
