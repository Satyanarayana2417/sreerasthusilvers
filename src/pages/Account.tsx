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
  const { logout, userProfile } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const quickAccessCards = [
    { id: 'orders', label: 'Orders', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', path: '/orders' },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50', path: '/wishlist' },
    { id: 'coupons', label: 'Coupons', icon: Ticket, color: 'text-orange-600', bg: 'bg-orange-50', path: '/coupons' },
    { id: 'help', label: 'Help Center', icon: HelpCircle, color: 'text-green-600', bg: 'bg-green-50', path: '/help' },
  ];

  const accountSettings = [
    { id: 'plus', label: 'Premium Plus', icon: Sparkles, color: 'text-yellow-600' },
    { id: 'profile', label: 'Edit Profile', icon: User, color: 'text-blue-600' },
    { id: 'cards', label: 'Saved Credit / Debit & Gift Cards', icon: CreditCard, color: 'text-purple-600' },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin, color: 'text-red-600' },
    { id: 'language', label: 'Select Language', icon: Globe, color: 'text-blue-600' },
    { id: 'notifications', label: 'Notification Settings', icon: Bell, color: 'text-green-600' },
    { id: 'privacy', label: 'Privacy Center', icon: Shield, color: 'text-gray-600' },
  ];

  const myActivity = [
    { id: 'reviews', label: 'Reviews', icon: Star, color: 'text-yellow-600' },
    { id: 'questions', label: 'Questions & Answers', icon: MessageCircle, color: 'text-blue-600' },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-sm p-6 mb-8"
          >
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome, {userProfile?.username || 'User'}!
                </h1>
                <p className="text-gray-600">{userProfile?.email}</p>
                <div className="flex items-center mt-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {userProfile?.role === 'admin' ? 'Administrator' : 'Customer'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Access Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Access</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickAccessCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                  onClick={() => navigate(card.path)}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className={`w-12 h-12 ${card.bg} rounded-lg flex items-center justify-center mb-3`}>
                    <card.icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900">{card.label}</h3>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Account Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {accountSettings.map((setting, index) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <setting.icon className={`w-5 h-5 ${setting.color}`} />
                    <span className="font-medium text-gray-900">{setting.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* My Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Activity</h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {myActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    <span className="font-medium text-gray-900">{activity.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Logout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-4 hover:bg-red-50 text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
      <MobileBottomNav />
    </>
  );
};

export default Account;