import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import LoadingScreen from '@/components/LoadingScreen';
import { subscribeToUserOrders, Order, updateOrderStatus } from '@/services/orderService';
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
  ChevronDown,
  Sparkles,
  Ticket,
  Globe,
  Star,
  MessageCircle,
  Mail,
  Lock,
  Eye,
  Settings,
  RotateCcw,
  EyeOff,
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
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const { loginWithGoogle, login, signup, resetPassword } = useAuth();
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
        setError('Popup was blocked by browser. Please allow popups and try again.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized. Please contact support.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Google sign-in is not enabled. Please contact support.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('Multiple popups detected. Please try again.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(`Failed to sign in with Google: ${err.message || 'Please try again.'}`);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (isSignUp && !fullName) {
      setError('Please enter your full name.');
      return;
    }

    if (isSignUp && !agreeTerms) {
      setError('Please agree to the terms and conditions.');
      return;
    }

    setEmailLoading(true);

    try {
      if (isSignUp) {
        await signup(email, password, fullName);
        navigate('/account');
      } else {
        const userProfile = await login(email, password);
        if (userProfile.role === 'admin') {
          navigate('/admin/dashboard');
        }
      }
    } catch (err: any) {
      console.error('Email auth error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setEmailLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    try {
      await resetPassword(email);
      setResetSent(true);
      setError('');
    } catch (err: any) {
      setError('Failed to send reset email. Please check your email address.');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-5 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-gray-500 text-sm">
                {isSignUp ? 'Sign up to get started' : 'Sign in to access your account'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4"
              >
                <p className="text-red-600 text-sm text-center">{error}</p>
              </motion.div>
            )}

            {/* Reset Password Success */}
            {resetSent && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4"
              >
                <p className="text-green-600 text-sm text-center">Password reset email sent! Check your inbox.</p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              {/* Full Name - only for Sign Up */}
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </motion.div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Terms Agreement */}
              {isSignUp && (
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-500">
                    I agree to all <span className="text-blue-600 cursor-pointer">Terms</span>, <span className="text-blue-600 cursor-pointer">Privacy Policy</span> and fees
                  </span>
                </div>
              )}

              {/* Sign In / Sign Up Button */}
              <Button
                type="submit"
                disabled={emailLoading}
                className="w-full py-3 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all"
              >
                {emailLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  isSignUp ? 'Sign Up' : 'Sign In'
                )}
              </Button>
            </form>

            {/* Forgot Password */}
            {!isSignUp && (
              <div className="text-center mt-3">
                <span className="text-xs text-gray-500">Forgot Login Detail? </span>
                <button
                  onClick={handleForgotPassword}
                  className="text-xs text-blue-600 font-medium hover:underline"
                >
                  Reset
                </button>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Social Sign In */}
            <div className="space-y-3">
              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                )}
                {googleLoading ? 'Signing In...' : 'Sign in with Google'}
              </button>
            </div>

            {/* Toggle Sign In / Sign Up */}
            <div className="text-center mt-6">
              <span className="text-sm text-gray-500">
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              </span>
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setResetSent(false);
                }}
                className="text-sm text-blue-600 font-semibold hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Sign Up Now'}
              </button>
            </div>
          </motion.div>
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Subscribe to user orders
  useEffect(() => {
    if (!user) return;

    console.log('Setting up order subscription for user:', user.uid);
    setOrdersLoading(true);
    
    const unsubscribe = subscribeToUserOrders(
      user.uid,
      (fetchedOrders) => {
        console.log('Fetched orders:', fetchedOrders.length);
        setOrders(fetchedOrders);
        setOrdersLoading(false);
      },
      (error) => {
        console.error('Error fetching orders:', error);
        console.error('Error details:', error.message, (error as any).code);
        
        // Check if it's an index error
        if (error.message?.includes('index') || error.message?.includes('requires an index')) {
          console.error('FIRESTORE INDEX REQUIRED: Please create the composite index for orders collection');
          console.error('Follow the link in the error message above or check the browser console');
        }
        
        setOrdersLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up order subscription');
      unsubscribe();
    };
  }, [user]);

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

  // Filter orders based on selected tab
  const filteredOrders = orders.filter(order => {
    if (selectedOrderTab === 'current') {
      return ['pending', 'processing', 'shipped'].includes(order.status);
    } else if (selectedOrderTab === 'all') {
      return true;
    }
    return false;
  });

  // Format price in INR
  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  // Get status color
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'processing':
        return 'text-blue-600';
      case 'shipped':
        return 'text-purple-600';
      case 'delivered':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Get status label
  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'On the way';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }) + ', ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Format payment method
  const formatPaymentMethod = (method: string) => {
    if (method === 'cod') return 'Cash On Delivery';
    if (method === 'online') return 'Online Payment';
    if (method === 'card') return 'Card Payment';
    // Capitalize first letter of each word
    return method.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

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
        <div className="min-h-screen pt-1 bg-gray-50 pb-20" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <div className="px-4 py-2">
            {/* Amazon-style Account Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              {/* Top Row: User info and icons */}
              <div className="flex items-center justify-between mb-4">
                {/* User Avatar and Name */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-gray-900">
                      Hello, {(userProfile?.username || user?.email?.split('@')[0] || 'User').slice(0, 12)}...
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>

              {/* Quick Action Pills */}
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
                <button 
                  onClick={() => setSelectedMenu('orders')}
                  className="flex-shrink-0 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                >
                  Orders
                </button>
                <button 
                  onClick={() => navigate('/wishlist')}
                  className="flex-shrink-0 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                >
                  Buy Again
                </button>
                <button 
                  onClick={() => setSelectedMenu('profile')}
                  className="flex-shrink-0 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                >
                  Account
                </button>
                <button 
                  onClick={() => navigate('/wishlist')}
                  className="flex-shrink-0 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                >
                  Lists
                </button>
              </div>
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
                  {ordersLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">No orders found</p>
                    </div>
                  ) : (
                    filteredOrders.map((order) => (
                      <div 
                        key={order.id} 
                        className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow bg-gray-50"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                      >
                        {/* Order Items Display */}
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-3">
                              <div className="w-16 h-16 bg-white rounded-lg flex-shrink-0 overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-900 mb-1">{item.name}</h4>
                                <p className="text-xs text-gray-600">Price: {formatPrice(item.price)}</p>
                                <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-xs font-medium ${getStatusColor(order.status)}`}>
                                    {getStatusLabel(order.status)}
                                  </span>
                                  <span className="text-xs text-gray-500">•</span>
                                  <span className="text-xs text-gray-500">{formatDate(order.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
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

        {/* Order Details Modal - Mobile */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Order Details</h3>
                <button 
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Order Number */}
                <div>
                  <h4 className="text-base font-bold text-gray-900">Order #: {selectedOrder.orderId}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedOrder.items.length} Products | By sree rasthu silvers | {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>

                {/* Order Details Grid */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Status:</span>
                    <span className={`font-semibold ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Payment:</span>
                    <span className="font-semibold text-gray-900">
                      {formatPaymentMethod(selectedOrder.paymentMethod)}
                    </span>
                  </div>
                  
                  <div className="py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium block mb-1">Delivered to:</span>
                    <span className="font-semibold text-gray-900 text-sm">
                      {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 font-medium">Total:</span>
                    <span className="font-bold text-gray-900 text-lg">
                      {formatPrice(selectedOrder.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
                    {ordersLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                      </div>
                    ) : filteredOrders.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No orders found</p>
                      </div>
                    ) : (
                      filteredOrders.map((order) => (
                        <div 
                          key={order.id} 
                          className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow bg-gray-50"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderModal(true);
                          }}
                        >
                          {/* Order Items Display */}
                          <div className="space-y-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex gap-4">
                                <div className="w-20 h-20 bg-white rounded-lg flex-shrink-0 overflow-hidden">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-base font-semibold text-gray-900 mb-1">{item.name}</h4>
                                  <p className="text-sm text-gray-600">Price: {formatPrice(item.price)}</p>
                                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                                      {getStatusLabel(order.status)}
                                    </span>
                                    <span className="text-sm text-gray-500">•</span>
                                    <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
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

      {/* Order Details Modal - Desktop */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">Order Details</h3>
              <button 
                onClick={() => setShowOrderModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Number */}
              <div>
                <h4 className="text-xl font-bold text-gray-900">Order #: {selectedOrder.orderId}</h4>
                <p className="text-base text-gray-600 mt-2">
                  {selectedOrder.items.length} Products | By sree rasthu silvers | {formatDate(selectedOrder.createdAt)}
                </p>
              </div>

              {/* Order Details Grid */}
              <div className="space-y-4 text-base">
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Status:</span>
                  <span className={`font-semibold text-lg ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>
                
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Payment:</span>
                  <span className="font-semibold text-gray-900">
                    {formatPaymentMethod(selectedOrder.paymentMethod)}
                  </span>
                </div>
                
                <div className="py-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium block mb-2">Delivered to:</span>
                  <span className="font-semibold text-gray-900">
                    {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                  </span>
                </div>
                
                <div className="flex justify-between py-3">
                  <span className="text-gray-600 font-medium text-lg">Total:</span>
                  <span className="font-bold text-gray-900 text-2xl">
                    {formatPrice(selectedOrder.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Account;