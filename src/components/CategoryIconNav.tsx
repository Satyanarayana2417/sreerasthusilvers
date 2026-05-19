import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import heroJewelry from "@/assets/hero-jewelry.jpg";
import heroSilverJewelry from "@/assets/hero-silver-jewelry.png";
import collectionBanner from "@/assets/collection-banner.jpg";
import handmadeCrafting from "@/assets/handmade-crafting.jpg";
import promoSection from "@/assets/promo-section.jpg";
import shoppingBags from "@/assets/shopping-bags.png";
import silversofa from "@/assets/silversofa.png";
import promoHeart from "@/assets/promo-heart.jpg";
import ring1 from "@/assets/products/ring-1.jpg";
import categoryOrganic from "@/assets/categories/organic.jpg";
import categoryIcons from "@/assets/categories/icons.jpg";
import { 
  Gem, 
  Armchair, 
  BookOpen, 
  Package, 
  Shirt, 
  ChefHat, 
  Sparkles, 
  Crown, 
  Coins, 
  Gift
} from "lucide-react";

const categories = [
  { 
    name: "Jewelry", 
    icon: Gem, 
    href: "/jewelry",
    image: heroJewelry,
  },
  { 
    name: "Furniture", 
    icon: Armchair, 
    href: "/furniture",
    image: silversofa,
  },
  { 
    name: "Articles", 
    icon: BookOpen, 
    href: "/articles",
    image: categoryIcons,
  },
  { 
    name: "Other Products", 
    icon: Package, 
    href: "/products",
    image: heroSilverJewelry,
  },
  { 
    name: "Fashion", 
    icon: Shirt, 
    href: "/jewelry",
    image: promoHeart,
  },
  { 
    name: "Home & Kitchen", 
    icon: ChefHat, 
    href: "/home-decor",
    image: categoryOrganic,
  },
  { 
    name: "Beauty & Toys", 
    icon: Sparkles, 
    href: "/other-products/baby-items",
    image: handmadeCrafting,
  },
  { 
    name: "Silver Chairs", 
    icon: Crown, 
    href: "/furniture/royal-silver-chairs",
    image: silversofa,
  },
  { 
    name: "Silver Coins", 
    icon: Coins, 
    href: "/other-products/silver-coins",
    image: ring1,
  },
  { 
    name: "Gift Articles", 
    icon: Gift, 
    href: "/articles/gift-articles",
    image: shoppingBags,
  },
];

const CategoryIconNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const desktopScrollRef = useRef<HTMLDivElement>(null);

  // Restore scroll position on mount
  useEffect(() => {
    const savedMobileScroll = sessionStorage.getItem('categoryMobileScrollPos');
    const savedDesktopScroll = sessionStorage.getItem('categoryDesktopScrollPos');
    
    if (savedMobileScroll && mobileScrollRef.current) {
      mobileScrollRef.current.scrollLeft = parseInt(savedMobileScroll);
    }
    if (savedDesktopScroll && desktopScrollRef.current) {
      desktopScrollRef.current.scrollLeft = parseInt(savedDesktopScroll);
    }
  }, [location.pathname]);

  // Save scroll position before navigation
  const handleCategoryClick = (href: string) => {
    if (href === "#") return;
    
    // Save current scroll positions
    if (mobileScrollRef.current) {
      sessionStorage.setItem('categoryMobileScrollPos', mobileScrollRef.current.scrollLeft.toString());
    }
    if (desktopScrollRef.current) {
      sessionStorage.setItem('categoryDesktopScrollPos', desktopScrollRef.current.scrollLeft.toString());
    }
    
    navigate(href);
  };

  return (
    <>
      {/* ====== MOBILE: Circular image categories (Tanishq style) ====== */}
      <section className="lg:hidden bg-white pt-2 pb-4">
        <div ref={mobileScrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide px-4">
          {categories.map((category, index) => {
            const isActive = location.pathname === category.href;
            return (
              <motion.a
                key={category.name}
                href={category.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick(category.href);
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.04 }}
                className="flex flex-col items-center gap-2 min-w-[90px] flex-shrink-0"
              >
                {/* Circular Image with ring */}
                <div className={`w-[86px] h-[86px] rounded-full p-[2px] transition-all duration-200 ${
                  isActive 
                    ? "bg-[#832729]" 
                    : "bg-[#832729]"
                }`}>
                  <div className="w-full h-full rounded-full overflow-hidden bg-white p-[6px]">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover rounded-full"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src = collectionBanner;
                      }}
                    />
                  </div>
                </div>
                {/* Category Name */}
                <span className={`text-[11px] font-medium text-center leading-tight max-w-[90px] ${
                  isActive ? "text-[#832729]" : "text-gray-700"
                }`}>
                  {category.name}
                </span>
              </motion.a>
            );
          })}
        </div>
      </section>

      {/* ====== DESKTOP: Icon + text horizontal nav (Tanishq style) ====== */}
      <nav className="hidden lg:block bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-12 lg:px-16">
          <div ref={desktopScrollRef} className="flex items-center justify-start gap-0 overflow-x-auto scrollbar-hide">
            {categories.map((category, index) => {
              const isActive = location.pathname === category.href;
              const Icon = category.icon;

              return (
                <motion.a
                  key={category.name}
                  href={category.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick(category.href);
                  }}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`flex items-center gap-1.5 px-3 py-2 whitespace-nowrap text-[13px] font-normal transition-all duration-200 relative group flex-shrink-0 ${
                    isActive
                      ? "text-[#413F3A]"
                      : "text-[#413F3A] hover:text-[#413F3A]"
                  }`}
                  style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}
                >
                  <Icon className={`w-[17px] h-[17px] transition-colors duration-200 ${
                    isActive ? "text-[#413F3A]" : "text-[#413F3A] group-hover:text-[#413F3A]"
                  }`} strokeWidth={1.5} />
                  <span>{category.name}</span>

                  {/* Active indicator line at bottom */}
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryBar"
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#413F3A] rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.a>
              );
            })}
          </div>
        </div>
      </nav>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default CategoryIconNav;
