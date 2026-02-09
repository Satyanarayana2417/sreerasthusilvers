import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth Provider
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import ShoppingCart from "@/components/ShoppingCart";

// Route Guards
import ProtectedRoute from "@/guards/ProtectedRoute";
import AdminRoute from "@/guards/AdminRoute";

// Public Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ShopNecklaces from "./pages/ShopNecklaces";
import ShopRings from "./pages/ShopRings";
import ShopBracelets from "./pages/ShopBracelets";
import ShopAnklets from "./pages/ShopAnklets";
import ShopPendants from "./pages/ShopPendants";
import ShopEarrings from "./pages/ShopEarrings";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Account from "./pages/Account";
import SavedAddresses from "./pages/SavedAddresses";
import LoadingScreen from "./components/LoadingScreen";
import MobileCart from "./pages/MobileCart";

// Bracelet Category Pages
import DiamondBracelets from "./pages/categories/DiamondBracelets";
import GemstoneBracelets from "./pages/categories/GemstoneBracelets";
import PearlBracelets from "./pages/categories/PearlBracelets";
import GoldBracelets from "./pages/categories/GoldBracelets";
import SilverBracelets from "./pages/categories/SilverBracelets";
import BangleBracelets from "./pages/categories/BangleBracelets";

// Necklace Category Pages
import DiamondNecklaces from "./pages/categories/DiamondNecklaces";
import GemstoneNecklaces from "./pages/categories/GemstoneNecklaces";
import PearlNecklaces from "./pages/categories/PearlNecklaces";
import GoldNecklaces from "./pages/categories/GoldNecklaces";
import SilverNecklaces from "./pages/categories/SilverNecklaces";
import CrossNecklaces from "./pages/categories/CrossNecklaces";

// Ring Category Pages
import DiamondRings from "./pages/categories/DiamondRings";
import GemstoneRings from "./pages/categories/GemstoneRings";
import WeddingRings from "./pages/categories/WeddingRings";
import EngagementRings from "./pages/categories/EngagementRings";
import GoldRings from "./pages/categories/GoldRings";
import FashionRings from "./pages/categories/FashionRings";

// Jewelry Category Pages
import JewelryCollections from "./pages/JewelryCollections";
import MensJewelry from "./pages/MensJewelry";
import BirthstoneJewelry from "./pages/BirthstoneJewelry";
import PearlJewelry from "./pages/PearlJewelry";
import RoseGoldJewelry from "./pages/RoseGoldJewelry";
import NewArrivals from "./pages/NewArrivals";
import JewelrySale from "./pages/JewelrySale";

// Furniture Pages
import FurnitureCollections from "./pages/FurnitureCollections";
import SilverSofaCollection from "./pages/SilverSofaCollection";
import RoyalSilverChairs from "./pages/RoyalSilverChairs";
import RoyalSilverTables from "./pages/RoyalSilverTables";
import AntiqueSilverDecor from "./pages/AntiqueSilverDecor";
import SilverSwingJhoola from "./pages/SilverSwingJhoola";

// Articles Pages
import ArticlesCollections from "./pages/ArticlesCollections";
import SilverPoojaKalashSet from "./pages/SilverPoojaKalashSet";
import SilverCoconut from "./pages/SilverCoconut";
import SilverFootwear from "./pages/SilverFootwear";
import SilverGopuramIdolStand from "./pages/SilverGopuramIdolStand";
import SilverCamelCart from "./pages/SilverCamelCart";
import SilverJhula from "./pages/SilverJhula";

// Other Products Pages
import OtherProductsCollections from "./pages/OtherProductsCollections";
import SilverIdols from "./pages/SilverIdols";
import SilverPoojaItems from "./pages/SilverPoojaItems";
import SilverGiftArticles from "./pages/SilverGiftArticles";
import CustomEngravedItems from "./pages/CustomEngravedItems";
import SilverCoins from "./pages/SilverCoins";
import LimitedEditionPieces from "./pages/LimitedEditionPieces";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import ProductForm from "./pages/admin/ProductForm";
import Orders from "./pages/admin/Orders";
import Media from "./pages/admin/Media";
import Settings from "./pages/admin/Settings";
import AdminBanners from "./pages/AdminBanners";

const queryClient = new QueryClient();

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <LoadingScreen onComplete={() => setIsLoaded(true)} />
            <BrowserRouter>
              <ShoppingCart />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              
              {/* Mobile Cart Page */}
              <Route path="/cart" element={<MobileCart />} />
              
              {/* Jewelry Collections Main Page */}
              <Route path="/jewelry" element={<JewelryCollections />} />
              
              {/* Furniture Collections Main Page */}
              <Route path="/furniture" element={<FurnitureCollections />} />
              
              {/* Articles Collections Main Page */}
              <Route path="/articles" element={<ArticlesCollections />} />
              
              {/* Other Products Collections Main Page */}
              <Route path="/products" element={<OtherProductsCollections />} />
              
              {/* Jewellery Routes */}
              <Route path="/shop/necklaces" element={<ShopNecklaces />} />
              <Route path="/shop/rings" element={<ShopRings />} />
              <Route path="/shop/bracelets" element={<ShopBracelets />} />
              <Route path="/shop/anklets" element={<ShopAnklets />} />
              <Route path="/shop/pendants" element={<ShopPendants />} />
              <Route path="/shop/earrings" element={<ShopEarrings />} />
              
              {/* Bracelet Category Routes */}
              <Route path="/categories/bracelets/diamond" element={<DiamondBracelets />} />
              <Route path="/categories/bracelets/gemstone" element={<GemstoneBracelets />} />
              <Route path="/categories/bracelets/pearl" element={<PearlBracelets />} />
              <Route path="/categories/bracelets/gold" element={<GoldBracelets />} />
              <Route path="/categories/bracelets/silver" element={<SilverBracelets />} />
              <Route path="/categories/bracelets/bangle" element={<BangleBracelets />} />
              
              {/* Necklace Category Routes */}
              <Route path="/categories/necklaces/diamond" element={<DiamondNecklaces />} />
              <Route path="/categories/necklaces/gemstone" element={<GemstoneNecklaces />} />
              <Route path="/categories/necklaces/pearl" element={<PearlNecklaces />} />
              <Route path="/categories/necklaces/gold" element={<GoldNecklaces />} />
              <Route path="/categories/necklaces/silver" element={<SilverNecklaces />} />
              <Route path="/categories/necklaces/cross" element={<CrossNecklaces />} />
              
              {/* Ring Category Routes */}
              <Route path="/categories/rings/diamond" element={<DiamondRings />} />
              <Route path="/categories/rings/gemstone" element={<GemstoneRings />} />
              <Route path="/categories/rings/wedding" element={<WeddingRings />} />
              <Route path="/categories/rings/engagement" element={<EngagementRings />} />
              <Route path="/categories/rings/gold" element={<GoldRings />} />
              <Route path="/categories/rings/fashion" element={<FashionRings />} />
              
              {/* Jewelry Category Routes */}
              <Route path="/categories/jewelry/mens" element={<MensJewelry />} />
              <Route path="/categories/jewelry/birthstone" element={<BirthstoneJewelry />} />
              <Route path="/categories/jewelry/pearl" element={<PearlJewelry />} />
              <Route path="/categories/jewelry/rose-gold" element={<RoseGoldJewelry />} />
              <Route path="/categories/jewelry/new-arrivals" element={<NewArrivals />} />
              <Route path="/categories/jewelry/sale" element={<JewelrySale />} />
              
              {/* Furniture Routes */}
              <Route path="/furniture/silver-sofa-collection" element={<SilverSofaCollection />} />
              <Route path="/furniture/royal-silver-chairs" element={<RoyalSilverChairs />} />
              <Route path="/furniture/royal-silver-tables" element={<RoyalSilverTables />} />
              <Route path="/furniture/antique-silver-decor" element={<AntiqueSilverDecor />} />
              <Route path="/furniture/silver-swing-jhoola" element={<SilverSwingJhoola />} />
              
              {/* Articles Routes */}
              <Route path="/articles/silver-pooja-kalash-set" element={<SilverPoojaKalashSet />} />
              <Route path="/articles/silver-coconut" element={<SilverCoconut />} />
              <Route path="/articles/silver-footwear" element={<SilverFootwear />} />
              <Route path="/articles/silver-gopuram-idol-stand" element={<SilverGopuramIdolStand />} />
              <Route path="/articles/silver-camel-cart" element={<SilverCamelCart />} />
              <Route path="/articles/silver-jhula" element={<SilverJhula />} />
              
              {/* Other Products Routes */}
              <Route path="/products/silver-idols" element={<SilverIdols />} />
              <Route path="/products/silver-pooja-items" element={<SilverPoojaItems />} />
              <Route path="/products/silver-gift-articles" element={<SilverGiftArticles />} />
              <Route path="/products/custom-engraved-items" element={<CustomEngravedItems />} />
              <Route path="/products/silver-coins" element={<SilverCoins />} />
              <Route path="/products/limited-edition-pieces" element={<LimitedEditionPieces />} />
              
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/account" element={<Account />} />
              <Route path="/account/addresses" element={<SavedAddresses />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              
              {/* Auth Routes - all point to Account page */}
              <Route path="/login" element={<Account />} />
              <Route path="/auth/login" element={<Account />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/signup" element={<Signup />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />

              {/* Admin Login (separate from admin panel) */}
              <Route path="/admin" element={<AdminLogin />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/:productId" element={<ProductForm />} />
                <Route path="orders" element={<Orders />} />
                <Route path="media" element={<Media />} />
                <Route path="settings" element={<Settings />} />
                <Route path="banners" element={<AdminBanners />} />
              </Route>

              {/* 404 Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
