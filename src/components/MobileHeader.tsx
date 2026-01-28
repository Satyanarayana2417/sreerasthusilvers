import { MapPin, ChevronDown, IndianRupee, Plane, ShoppingCart as GroceryIcon } from "lucide-react";
import logo from "../assets/logo-new.png";

const MobileHeader = () => {
  return (
    <header className="lg:hidden bg-blue-500 text-white">
      {/* Top Bar with Logo and Utility Icons */}
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img src={logo} alt="Sree Rasthu Silvers" className="h-8 w-auto brightness-0 invert" />
        </a>

        {/* Utility Icons */}
        <div className="flex items-center gap-2">
          <button className="flex flex-col items-center gap-0.5 px-2 py-1 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
            <IndianRupee className="w-4 h-4" />
            <span className="text-[9px] font-medium">Finance</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 px-2 py-1 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
            <Plane className="w-4 h-4" />
            <span className="text-[9px] font-medium">Travel</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 px-2 py-1 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
            <GroceryIcon className="w-4 h-4" />
            <span className="text-[9px] font-medium">Grocery</span>
          </button>
        </div>
      </div>

      {/* Location Selector */}
      <div className="px-4 pb-3">
        <button className="flex items-center gap-1 text-white/90 hover:text-white transition-colors">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-xs font-medium truncate max-w-[200px]">3-25, Om shanthi bhavan road, opp...</span>
          <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
        </button>
      </div>
    </header>
  );
};

export default MobileHeader;
