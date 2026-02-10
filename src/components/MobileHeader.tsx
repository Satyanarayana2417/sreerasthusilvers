import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import logo from "../assets/logo-new.png";

const MobileHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        // Always show header at top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide header
        setIsVisible(false);
      } else {
        // Scrolling up - show header
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlHeader);
    return () => window.removeEventListener('scroll', controlHeader);
  }, [lastScrollY]);

  return (
    <header className={`lg:hidden bg-white shadow-sm sticky top-0 z-50 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      {/* Top Bar with Logo and Profile */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo - Left Side */}
        <a href="/" className="flex items-center gap-2 ml-2">
          <img src={logo} alt="Logo" className="h-10 w-auto object-contain" style={{ imageRendering: 'crisp-edges' }} />
        </a>

        {/* User Profile Icon */}
        <button 
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          onClick={() => navigate('/account')}
        >
          {user ? (
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
          )}
        </button>
      </div>
    </header>
  );
};

export default MobileHeader;
