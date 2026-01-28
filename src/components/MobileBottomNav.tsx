import { Home, Grid, User, ShoppingCart, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import MobileSidebar from "./MobileSidebar";

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems, toggleCart } = useCart();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: "Home", icon: Home, href: "/", action: () => navigate("/") },
    { name: "Categories", icon: Grid, href: "#", action: () => {} },
    { name: "Cart", icon: ShoppingCart, href: "#", action: toggleCart, badge: totalItems, showPrice: true },
    { name: "Sign In", icon: User, href: "/profile", action: () => navigate("/profile") },
    { name: "Menu", icon: Menu, href: "#", action: () => setIsSidebarOpen(true) },
  ];

  return (
    <>
      <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
        <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <button
              key={item.name}
              onClick={item.action}
              className="flex flex-col items-center justify-center flex-1 h-full relative"
            >
              <div className="relative">
                <Icon 
                  className={`w-6 h-6 ${
                    isActive ? "text-blue-600" : "text-gray-600"
                  }`} 
                />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </div>
              <span 
                className={`text-[10px] font-medium mt-1 ${
                  isActive ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {item.showPrice ? "₹0.00" : item.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
    </>
  );
};

export default MobileBottomNav;
