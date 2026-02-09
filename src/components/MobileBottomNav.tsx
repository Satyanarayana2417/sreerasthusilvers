import { Home, Grid, ShoppingCart, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import MobileSidebar from "./MobileSidebar";

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems, subtotal } = useCart();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Listen for sidebar toggle events from MobileHeader
  useEffect(() => {
    const handleToggle = () => setIsSidebarOpen(true);
    window.addEventListener('toggle-mobile-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-mobile-sidebar', handleToggle);
  }, []);

  // Format price compactly for mobile
  const formatMobilePrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 safe-area-pb">
        <div className="flex items-center justify-around h-16">
          {/* Home */}
          <button
            onClick={() => navigate("/")}
            className="flex flex-col items-center justify-center flex-1 h-full"
          >
            <Home className={`w-[22px] h-[22px] ${isActive("/") ? "text-orange-500" : "text-gray-500"}`} />
            <span className={`text-[10px] font-medium mt-1 ${isActive("/") ? "text-orange-500" : "text-gray-500"}`}>
              Home
            </span>
          </button>

          {/* Categories */}
          <button
            onClick={() => {}}
            className="flex flex-col items-center justify-center flex-1 h-full"
          >
            <Grid className="w-[22px] h-[22px] text-gray-500" />
            <span className="text-[10px] font-medium mt-1 text-gray-500">Categories</span>
          </button>

          {/* Cart — special orange badge design */}
          <button
            onClick={() => navigate("/cart")}
            className="flex flex-col items-center justify-center flex-1 h-full relative"
          >
            <div className="relative">
              <ShoppingCart className="w-[22px] h-[22px] text-gray-600" />
              {/* Orange circle badge */}
              <span className="absolute -top-2.5 -right-3 min-w-[20px] h-[20px] px-1 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm shadow-orange-500/30">
                {totalItems}
              </span>
            </div>
            <span className="text-[10px] font-semibold mt-1 text-gray-700">
              {formatMobilePrice(subtotal)}
            </span>
          </button>

          {/* Menu */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex flex-col items-center justify-center flex-1 h-full"
          >
            <Menu className="w-[22px] h-[22px] text-gray-500" />
            <span className="text-[10px] font-medium mt-1 text-gray-500">Menu</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default MobileBottomNav;
