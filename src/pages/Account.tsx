import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import LoadingScreen from '@/components/LoadingScreen';
import {
  Loader2,
  User,
  CreditCard,
  MapPin,
  Bell,
  Shield,
  HelpCircle,
  Heart,
  Package,
  LogOut,
  ChevronRight,
  Sparkles,
  Ticket,
  Globe,
  Star,
  MessageCircle,
} from 'lucide-react';

const Account = () => {
  const { user, userProfile, loading, logout } = useAuth();

  // Loading state
  if (loading) {
    return <LoadingScreen />;
  }

  // If user is not authenticated, show login form
  if (!user) {
    return <LoginForm />;
  }

  // If user is authenticated, show account page
  return <AccountPage />;
};

// Login Form Component
const LoginForm = () => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      const userProfile = await loginWithGoogle();
      if (userProfile.role === 'admin') {
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed. Please try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked by browser. Please allow popups.');
      } else {
        setError('Failed to sign in with Google. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-60px)] pt-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h1>
                <p className="text-gray-600">Sign in to access your account</p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6"
                >
                  <p className="text-red-600 text-sm">{error}</p>
                </motion.div>
              )}

              {/* Google Sign In */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full h-14 border-gray-300 hover:bg-gray-50 font-medium text-base"
              >
                {googleLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

// Account Page Component
const AccountPage = () => {
  const navigate = useNavigate();
  const { logout, userProfile, user } = useAuth();
  const [selectedMenu, setSelectedMenu] = useState('orders');
  const [selectedOrderTab, setSelectedOrderTab] = useState('current');
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { id: 'orders', label: 'My orders', icon: Package, path: null },
    { id: 'addresses', label: 'Your addresses', icon: MapPin, path: '/account/addresses' },
    { id: 'security', label: 'Login & security', icon: Shield, path: null },
    { id: 'payments', label: 'Payments', icon: CreditCard, path: null },
    { id: 'archived', label: 'Archived orders', icon: Package, path: null },
    { id: 'saved', label: 'Saved items', icon: Heart, path: '/wishlist' },
    { id: 'support', label: 'Customer support', icon: MessageCircle, path: null },
    { id: 'logout', label: 'Log out', icon: LogOut, path: null, action: 'logout' },
  ];

  const quickAccessCards = [
    { id: 'orders', label: 'Orders', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', path: '/orders' },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50', path: '/wishlist' },
    { id: 'coupons', label: 'Coupons', icon: Ticket, color: 'text-orange-600', bg: 'bg-orange-50', path: '/coupons' },
    { id: 'help', label: 'Help Center', icon: HelpCircle, color: 'text-green-600', bg: 'bg-green-50', path: '/help' },
  ];

  const accountSettings = [
    { id: 'plus', label: 'Premium Plus', icon: Sparkles, color: 'text-yellow-600', path: '/premium' },
    { id: 'profile', label: 'Edit Profile', icon: User, color: 'text-blue-600', path: '/account/profile' },
    { id: 'cards', label: 'Saved Credit / Debit & Gift Cards', icon: CreditCard, color: 'text-purple-600', path: '/account/cards' },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin, color: 'text-red-600', path: '/account/addresses' },
    { id: 'language', label: 'Select Language', icon: Globe, color: 'text-blue-600', path: '/account/language' },
    { id: 'notifications', label: 'Notification Settings', icon: Bell, color: 'text-green-600', path: '/account/notifications' },
    { id: 'privacy', label: 'Privacy Center', icon: Shield, color: 'text-gray-600', path: '/account/privacy' },
  ];

  const myActivity = [
    { id: 'reviews', label: 'Reviews', icon: Star, color: 'text-yellow-600' },
    { id: 'questions', label: 'Questions & Answers', icon: MessageCircle, color: 'text-blue-600' },
  ];

  // Mock orders data
  const orders = [
    {
      id: '73262',
      products: 4,
      by: userProfile?.username || 'Alex John',
      date: '13:45, Nov 10, 2025',
      status: 'On the way',
      statusColor: 'text-orange-600',
      deliveryDate: 'Fri, 13 Nov, 2025',
      address: 'Great street, New York Brooklyn 5A, PO: 212891',
      total: 340.00,
      items: [
        { name: 'Great product name goes here', quantity: 1, price: 340, color: 'Silver', size: 'Large', image: '/src/assets/products/necklace-1.jpg' },
        { name: 'Table lamp for c', quantity: 1, price: 0, color: 'Silver', size: 'Large', image: '/src/assets/products/ring-1.jpg' },
        { name: 'Great product name goes here', quantity: 2, price: 87, color: 'Silver', size: '', image: '/src/assets/products/bracelet-1.jpg' },
        { name: 'Great cup white', quantity: 1, price: 0, color: 'Silver', size: '', image: '/src/assets/products/earring-1.jpg' },
      ]
    }
  ];

  const handleMenuClick = (menu: any) => {
    if (menu.action === 'logout') {
      handleLogout();
    } else if (menu.path) {
      navigate(menu.path);
    } else {
      setSelectedMenu(menu.id);
    }
  };

  // Mobile view - new design matching desktop
  if (isMobile) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-16 bg-gray-50 pb-20" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <div className="px-4 py-4">
            {/* Account Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Your Account</h2>
              <p className="text-xs text-gray-600">{userProfile?.username || 'satya'}, Email: {userProfile?.email || user?.email}</p>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white rounded-lg shadow-sm mb-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0 text-left transition-colors ${
                    selectedMenu === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Main Content */}
            {selectedMenu === 'orders' && (
              <div className="bg-white rounded-lg shadow-sm">
                {/* Order Tabs */}
                <div className="border-b border-gray-200 px-4 pt-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedOrderTab('current')}
                      className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                        selectedOrderTab === 'current'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600'
                      }`}
                    >
                      Current
                    </button>
                    <button
                      onClick={() => setSelectedOrderTab('unpaid')}
                      className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                        selectedOrderTab === 'unpaid'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600'
                      }`}
                    >
                      Unpaid
                    </button>
                    <button
                      onClick={() => setSelectedOrderTab('all')}
                      className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                        selectedOrderTab === 'all'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600'
                      }`}
                    >
                      All orders
                    </button>
                  </div>
                </div>

                {/* Orders List */}
                <div className="p-4 space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      {/* Order Header */}
                      <div className="mb-3">
                        <h3 className="text-sm font-bold text-gray-900 mb-1">Order #: {order.id}</h3>
                        <p className="text-xs text-gray-600">
                          {order.products} Products | By {order.by}
                        </p>
                        <p className="text-xs text-gray-600">{order.date}</p>
                      </div>

                      {/* Order Details */}
                      <div className="space-y-2 mb-4 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`font-medium ${order.statusColor}`}>{order.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date of delivery:</span>
                          <span className="font-medium text-gray-900">{order.deliveryDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivered to:</span>
                          <span className="font-medium text-gray-900 text-right ml-2">{order.address}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-bold text-gray-900">USD {order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                            <div className="w-16 h-16 bg-white rounded-lg flex-shrink-0 overflow-hidden">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-semibold text-gray-900 mb-1 truncate">{item.name}</h4>
                              <p className="text-xs text-gray-600">
                                Quantity: {item.quantity}x {item.price > 0 && `= USD ${item.price}`}
                              </p>
                              <p className="text-xs text-gray-600">Color: {item.color}</p>
                              {item.size && <p className="text-xs text-gray-600">Size: {item.size}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedMenu === 'addresses' && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Your Addresses</h3>
                <p className="text-sm text-gray-600 mb-4">Manage your saved addresses here.</p>
                <Button onClick={() => navigate('/account/addresses')} className="w-full">
                  View Addresses
                </Button>
              </div>
            )}

            {selectedMenu === 'security' && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Login & Security</h3>
                <p className="text-sm text-gray-600">Manage your login credentials and security settings.</p>
              </div>
            )}

            {selectedMenu === 'payments' && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Payments</h3>
                <p className="text-sm text-gray-600">Manage your payment methods and transaction history.</p>
              </div>
            )}

            {selectedMenu === 'archived' && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Archived Orders</h3>
                <p className="text-sm text-gray-600">View your archived orders.</p>
              </div>
            )}

            {selectedMenu === 'support' && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Customer Support</h3>
                <p className="text-sm text-gray-600">Get help with your orders and account.</p>
              </div>
            )}
          </div>
        </div>
        <MobileBottomNav />
      </>
    );
  }

  // Desktop view - new sidebar layout
  return (
    <>
      <Header />
      <div className="min-h-screen pt-16 bg-gray-50" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <div className="container mx-auto px-6 pb-8">
          <div className="grid grid-cols-12 gap-6 -mt-4">
            {/* Sidebar */}
            <div className="col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                {/* User Info */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Your Account</h2>
                  <p className="text-sm text-gray-600">{userProfile?.username || 'Alex John'}, Email: {userProfile?.email || user?.email}</p>
                </div>

                {/* Menu Items */}
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        selectedMenu === item.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-9">
              {selectedMenu === 'orders' && (
                <div className="bg-white rounded-lg shadow-sm">
                  {/* Order Tabs */}
                  <div className="border-b border-gray-200 px-6 pt-6">
                    <div className="flex gap-4">
                      <button
                        onClick={() => setSelectedOrderTab('current')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                          selectedOrderTab === 'current'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Current
                      </button>
                      <button
                        onClick={() => setSelectedOrderTab('unpaid')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                          selectedOrderTab === 'unpaid'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Unpaid
                      </button>
                      <button
                        onClick={() => setSelectedOrderTab('all')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                          selectedOrderTab === 'all'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        All orders
                      </button>
                    </div>
                  </div>

                  {/* Orders List */}
                  <div className="p-6 space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                        {/* Order Header */}
                        <div className="mb-4">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">Order #: {order.id}</h3>
                          <p className="text-sm text-gray-600">
                            {order.products} Products | By {order.by} | {order.date}
                          </p>
                        </div>

                        {/* Order Details */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-6 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={`font-medium ${order.statusColor}`}>{order.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date of delivery:</span>
                            <span className="font-medium text-gray-900">{order.deliveryDate}</span>
                          </div>
                          <div className="flex justify-between col-span-2">
                            <span className="text-gray-600">Delivered to:</span>
                            <span className="font-medium text-gray-900">{order.address}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total:</span>
                            <span className="font-bold text-gray-900">USD {order.total.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="grid grid-cols-2 gap-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-4 bg-gray-50 rounded-lg p-4">
                              <div className="w-20 h-20 bg-white rounded-lg flex-shrink-0 overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-900 mb-1 truncate">{item.name}</h4>
                                <p className="text-xs text-gray-600">
                                  Quantity: {item.quantity}x {item.price > 0 && `= USD ${item.price}`}
                                </p>
                                <p className="text-xs text-gray-600">Color: {item.color}</p>
                                {item.size && <p className="text-xs text-gray-600">Size: {item.size}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedMenu === 'addresses' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Your Addresses</h3>
                  <p className="text-gray-600">Manage your saved addresses here.</p>
                  <Button onClick={() => navigate('/account/addresses')} className="mt-4">
                    View Addresses
                  </Button>
                </div>
              )}

              {selectedMenu === 'security' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Login & Security</h3>
                  <p className="text-gray-600">Manage your login credentials and security settings.</p>
                </div>
              )}

              {selectedMenu === 'payments' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Payments</h3>
                  <p className="text-gray-600">Manage your payment methods and transaction history.</p>
                </div>
              )}

              {selectedMenu === 'archived' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Archived Orders</h3>
                  <p className="text-gray-600">View your archived orders.</p>
                </div>
              )}

              {selectedMenu === 'support' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Support</h3>
                  <p className="text-gray-600">Get help with your orders and account.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Account;