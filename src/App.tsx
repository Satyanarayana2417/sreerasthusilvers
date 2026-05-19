import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth Provider
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import ShoppingCart from "@/components/ShoppingCart";

// Route Guards
import ProtectedRoute from "@/guards/ProtectedRoute";
import AdminRoute from "@/guards/AdminRoute";
import DeliveryRoute from "@/guards/DeliveryRoute";

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
import CustomerSupport from "./pages/CustomerSupport";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import ShippingPolicy from "./pages/ShippingPolicy";
import CancellationRefundPolicy from "./pages/CancellationRefundPolicy";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Account from "./pages/Account";
import SavedAddresses from "./pages/SavedAddresses";
import BuyAgain from "./pages/BuyAgain";
import LoadingScreen from "./components/LoadingScreen";
import ScrollToTop from "./components/ScrollToTop";
import MobileCart from "./pages/MobileCart";
import MobileOrders from "./pages/MobileOrders";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import CancelOrderPage from "./pages/CancelOrderPage";
import ProfileEditPage from "./pages/ProfileEditPage";
import MobileCategories from "./pages/MobileCategories";
import MobileSearch from "./pages/MobileSearch";
import SearchResults from "./pages/SearchResults";

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
import SilverCradles from "./pages/SilverCradles";
import SilverThrones from "./pages/SilverThrones";

// Articles Pages
import ArticlesCollections from "./pages/ArticlesCollections";
import SilverPoojaItems from "./pages/SilverPoojaItems";
import SilverGiftArticles from "./pages/SilverGiftArticles";
import SilverLamps from "./pages/SilverLamps";
import SilverPlates from "./pages/SilverPlates";
import SilverIdols from "./pages/SilverIdols";
import SilverVessels from "./pages/SilverVessels";

// Other Products Pages
import OtherProductsCollections from "./pages/OtherProductsCollections";
import SilverCoins from "./pages/SilverCoins";
import SilverBars from "./pages/SilverBars";
import SilverUtensils from "./pages/SilverUtensils";
import BabyItems from "./pages/BabyItems";
import AntiqueSilver from "./pages/AntiqueSilver";
import CustomOrders from "./pages/CustomOrders";

// Home Decor Pages
import HomeDecorCollections from "./pages/HomeDecorCollections";
import SilverWallDecor from "./pages/SilverWallDecor";
import SilverPhotoFrames from "./pages/SilverPhotoFrames";
import SilverShowpieces from "./pages/SilverShowpieces";
import SilverCandleStands from "./pages/SilverCandleStands";
import SilverFlowerVases from "./pages/SilverFlowerVases";

// Gifts Pages
import GiftsCollections from "./pages/GiftsCollections";
import SilverWeddingGifts from "./pages/SilverWeddingGifts";
import SilverBirthdayGifts from "./pages/SilverBirthdayGifts";
import SilverFestivalGifts from "./pages/SilverFestivalGifts";
import SilverCorporateGifts from "./pages/SilverCorporateGifts";
import SilverReturnGifts from "./pages/SilverReturnGifts";

// Purchase Summary & Security Pages
import PurchaseSummary from "./pages/PurchaseSummary";
import SecurityPage from "./pages/SecurityPage";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import ProductForm from "./pages/admin/ProductForm";
import Media from "./pages/admin/Media";
import AdminBanners from "./pages/AdminBanners";
import AdminShowcases from "./pages/admin/AdminShowcases";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminOrders from "./pages/AdminOrders";
import AdminDeliveryBoys from "./pages/admin/AdminDeliveryBoys";
import AdminGiftCards from "./pages/admin/AdminGiftCards";
import AdminReviews from "./pages/admin/AdminReviews";
import WriteReview from "./pages/WriteReview";
import ThankYouReview from "./pages/ThankYouReview";

// Delivery Partner Pages
import DeliveryLogin from "./pages/delivery/DeliveryLogin";
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import DeliveryOrderDetails from "./pages/delivery/DeliveryOrderDetails";
import DeliveryMapPage from "./pages/delivery/DeliveryMapPage";

const AppContent = () => {
  const [isLoaded, setIsLoaded] = useState(() => sessionStorage.getItem('appLoaded') === 'true');

  const handleLoadingComplete = () => {
    setIsLoaded(true);
    sessionStorage.setItem('appLoaded', 'true');
  };

  if (!isLoaded) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <>
      <ShoppingCart />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/necklaces" element={<ShopNecklaces />} />
        <Route path="/shop/necklaces" element={<ShopNecklaces />} />
        <Route path="/rings" element={<ShopRings />} />
        <Route path="/shop/rings" element={<ShopRings />} />
        <Route path="/bracelets" element={<ShopBracelets />} />
        <Route path="/shop/bracelets" element={<ShopBracelets />} />
        <Route path="/anklets" element={<ShopAnklets />} />
        <Route path="/shop/anklets" element={<ShopAnklets />} />
        <Route path="/pendants" element={<ShopPendants />} />
        <Route path="/shop/pendants" element={<ShopPendants />} />
        <Route path="/earrings" element={<ShopEarrings />} />
        <Route path="/shop/earrings" element={<ShopEarrings />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/customer-support" element={<CustomerSupport />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsConditions />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/cancellation-and-refund-policy" element={<CancellationRefundPolicy />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/search-results" element={<SearchResults />} />

        {/* Bracelet Categories */}
        <Route path="/bracelets/diamond" element={<DiamondBracelets />} />
        <Route path="/bracelets/gemstone" element={<GemstoneBracelets />} />
        <Route path="/bracelets/pearl" element={<PearlBracelets />} />
        <Route path="/bracelets/gold" element={<GoldBracelets />} />
        <Route path="/bracelets/silver" element={<SilverBracelets />} />
        <Route path="/bracelets/bangle" element={<BangleBracelets />} />

        {/* Necklace Categories */}
        <Route path="/necklaces/diamond" element={<DiamondNecklaces />} />
        <Route path="/necklaces/gemstone" element={<GemstoneNecklaces />} />
        <Route path="/necklaces/pearl" element={<PearlNecklaces />} />
        <Route path="/necklaces/gold" element={<GoldNecklaces />} />
        <Route path="/necklaces/silver" element={<SilverNecklaces />} />
        <Route path="/necklaces/cross" element={<CrossNecklaces />} />

        {/* Ring Categories */}
        <Route path="/rings/diamond" element={<DiamondRings />} />
        <Route path="/rings/gemstone" element={<GemstoneRings />} />
        <Route path="/rings/wedding" element={<WeddingRings />} />
        <Route path="/rings/engagement" element={<EngagementRings />} />
        <Route path="/rings/gold" element={<GoldRings />} />
        <Route path="/rings/fashion" element={<FashionRings />} />

        {/* Jewelry Categories */}
        <Route path="/jewelry" element={<JewelryCollections />} />
        <Route path="/jewelry/mens" element={<MensJewelry />} />
        <Route path="/jewelry/birthstone" element={<BirthstoneJewelry />} />
        <Route path="/jewelry/pearl" element={<PearlJewelry />} />
        <Route path="/jewelry/rose-gold" element={<RoseGoldJewelry />} />
        <Route path="/jewelry/new-arrivals" element={<NewArrivals />} />
        <Route path="/jewelry/sale" element={<JewelrySale />} />

        {/* Furniture Pages */}
        <Route path="/furniture" element={<FurnitureCollections />} />
        <Route path="/furniture/silver-sofa-collection" element={<SilverSofaCollection />} />
        <Route path="/furniture/royal-silver-chairs" element={<RoyalSilverChairs />} />
        <Route path="/furniture/royal-silver-tables" element={<RoyalSilverTables />} />
        <Route path="/furniture/antique-silver-decor" element={<AntiqueSilverDecor />} />
        <Route path="/furniture/silver-swing-jhoola" element={<SilverSwingJhoola />} />
        <Route path="/furniture/silver-cradles" element={<SilverCradles />} />
        <Route path="/furniture/silver-thrones" element={<SilverThrones />} />

        {/* Articles Pages */}
        <Route path="/articles" element={<ArticlesCollections />} />
        <Route path="/articles/silver-pooja-items" element={<SilverPoojaItems />} />
        <Route path="/articles/gift-articles" element={<SilverGiftArticles />} />
        <Route path="/articles/silver-lamps" element={<SilverLamps />} />
        <Route path="/articles/silver-plates" element={<SilverPlates />} />
        <Route path="/articles/silver-idols" element={<SilverIdols />} />
        <Route path="/articles/silver-vessels" element={<SilverVessels />} />

        {/* Other Products Pages */}
        <Route path="/products" element={<OtherProductsCollections />} />
        <Route path="/other-products/silver-coins" element={<SilverCoins />} />
        <Route path="/other-products/silver-bars" element={<SilverBars />} />
        <Route path="/other-products/silver-utensils" element={<SilverUtensils />} />
        <Route path="/other-products/baby-items" element={<BabyItems />} />
        <Route path="/other-products/antique-silver" element={<AntiqueSilver />} />
        <Route path="/other-products/custom-orders" element={<CustomOrders />} />

        {/* Home Decor Pages */}
        <Route path="/home-decor" element={<HomeDecorCollections />} />
        <Route path="/home-decor/silver-wall-decor" element={<SilverWallDecor />} />
        <Route path="/home-decor/silver-photo-frames" element={<SilverPhotoFrames />} />
        <Route path="/home-decor/silver-showpieces" element={<SilverShowpieces />} />
        <Route path="/home-decor/silver-candle-stands" element={<SilverCandleStands />} />
        <Route path="/home-decor/silver-flower-vases" element={<SilverFlowerVases />} />

        {/* Gifts Pages */}
        <Route path="/gifts" element={<GiftsCollections />} />
        <Route path="/gifts/wedding" element={<SilverWeddingGifts />} />
        <Route path="/gifts/birthday" element={<SilverBirthdayGifts />} />
        <Route path="/gifts/festival" element={<SilverFestivalGifts />} />
        <Route path="/gifts/corporate" element={<SilverCorporateGifts />} />
        <Route path="/gifts/return" element={<SilverReturnGifts />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/profile-edit" element={<ProfileEditPage />} />
          <Route path="/account/addresses" element={<SavedAddresses />} />
          <Route path="/orders" element={<MobileOrders />} />
          <Route path="/account/orders" element={<Account />} />
          <Route path="/saved-addresses" element={<SavedAddresses />} />
          <Route path="/buy-again" element={<BuyAgain />} />
          <Route path="/mobile-cart" element={<MobileCart />} />
          <Route path="/mobile-orders" element={<MobileOrders />} />
          <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
          <Route path="/account/orders/:orderId" element={<OrderDetailsPage />} />
          <Route path="/orders/:orderId/cancel" element={<CancelOrderPage />} />
          <Route path="/account/orders/:orderId/cancel" element={<CancelOrderPage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
          <Route path="/purchase-summary" element={<PurchaseSummary />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/reviews/new/:orderId/:productId" element={<WriteReview />} />
          <Route path="/reviews/thank-you" element={<ThankYouReview />} />
        </Route>

        {/* Mobile Specific */}
        <Route path="/categories" element={<MobileCategories />} />
        <Route path="/mobile-categories" element={<MobileCategories />} />
        <Route path="/mobile-search" element={<MobileSearch />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="media" element={<Media />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="showcases" element={<AdminShowcases />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="delivery-boys" element={<AdminDeliveryBoys />} />
            <Route path="gift-cards" element={<AdminGiftCards />} />
            <Route path="reviews" element={<AdminReviews />} />
          </Route>
        </Route>

        {/* Delivery Partner Routes */}
        <Route path="/delivery/login" element={<DeliveryLogin />} />
        <Route element={<DeliveryRoute />}>
          <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
          <Route path="/delivery/orders/:orderId" element={<DeliveryOrderDetails />} />
          <Route path="/delivery/map" element={<DeliveryMapPage />} />
        </Route>

        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <ScrollToTop />
              <AppContent />
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
