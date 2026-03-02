import { Search, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MobileSearchBar = () => {
  const navigate = useNavigate();

  return (
    <div className="lg:hidden sticky top-0 z-40 bg-white px-4 py-2 shadow-sm">
      <button
        onClick={() => navigate("/search")}
        className="w-full relative flex items-center bg-white rounded-lg overflow-hidden border border-gray-300"
      >
        <Search className="absolute left-3 w-5 h-5 text-gray-400" />
        <div className="w-full pl-10 pr-12 py-2.5 text-sm text-gray-400 text-left">
          Search any Product..
        </div>
        <div className="absolute right-3 p-1">
          <Mic className="w-5 h-5 text-gray-400" />
        </div>
      </button>
    </div>
  );
};

export default MobileSearchBar;
