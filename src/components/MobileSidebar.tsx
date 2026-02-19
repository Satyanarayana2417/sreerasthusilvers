import { motion, AnimatePresence } from "framer-motion";
import { X, Home, Grid, User, ShoppingBag, Heart, Package, Settings, LogOut, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import logo from "../assets/logo-new.png";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  const navigate = useNavigate();
  const { user, userProfile, logout } = useAuth();

  const menuItems = [
    { name: "Home", icon: Home, href: "/", color: "text-blue-600" },
    { name: "Categories", icon: Grid, href: "/categories", color: "text-purple-600" },
    { name: "My Orders", icon: Package, href: "#", color: "text-green-600" },
    { name: "Wishlist", icon: Heart, href: "#", color: "text-red-600" },
    { name: "My Account", icon: User, href: "/profile", color: "text-orange-600" },
    { name: "Settings", icon: Settings, href: "/account", color: "text-gray-600" },
  ];

  const handleNavigation = (href: string) => {
    if (href !== "#") {
      navigate(href);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50 lg:hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-gray-100 text-gray-900 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {user && userProfile ? (
                  <>
                    {user.photoURL || userProfile.avatar ? (
                      <img 
                        key={user.photoURL || userProfile.avatar}
                        src={user.photoURL || userProfile.avatar} 
                        alt={userProfile.name || userProfile.username || 'User'} 
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-gray-300">
                        <span className="text-white font-semibold text-sm">
                          {(userProfile.name || userProfile.username || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-base">{userProfile.name || userProfile.username || 'User'}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Welcome</p>
                      <p className="text-xs text-gray-600">Sign in to continue</p>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col py-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNavigation(item.href)}
                    className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors group"
                  >
                    <Icon className={`w-5 h-5 ${item.color}`} />
                    <span className="text-sm font-medium text-gray-700 flex-1 text-left">
                      {item.name}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </motion.button>
                );
              })}
            </div>

            {/* Footer */}
            {user && (
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
                <button 
                  onClick={async () => {
                    await logout();
                    onClose();
                    navigate('/');
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;
