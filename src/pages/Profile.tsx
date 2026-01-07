import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  ShoppingBag,
  Star,
  User,
  CreditCard,
  MapPin,
  Globe,
  Bell,
  Shield,
  MessageSquare,
  HelpCircle,
  Tag,
  FileText,
  Heart,
  Package,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('my-orders');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarSections: SidebarSection[] = [
    {
      title: 'MY ORDERS',
      items: [
        { id: 'my-orders', label: 'My Orders', icon: <ShoppingBag className="w-5 h-5" />, badge: 2 },
      ],
    },
    {
      title: 'ACCOUNT SETTINGS',
      items: [
        { id: 'plus-membership', label: 'Brand Plus Membership', icon: <Sparkles className="w-5 h-5" /> },
        { id: 'edit-profile', label: 'Edit Profile', icon: <User className="w-5 h-5" /> },
        { id: 'saved-cards', label: 'Saved Cards', icon: <CreditCard className="w-5 h-5" /> },
        { id: 'saved-addresses', label: 'Saved Addresses', icon: <MapPin className="w-5 h-5" /> },
        { id: 'language', label: 'Select Language', icon: <Globe className="w-5 h-5" /> },
        { id: 'notifications', label: 'Notification Settings', icon: <Bell className="w-5 h-5" /> },
        { id: 'privacy', label: 'Privacy Center', icon: <Shield className="w-5 h-5" /> },
      ],
    },
    {
      title: 'MY ACTIVITY',
      items: [
        { id: 'reviews', label: 'Reviews', icon: <Star className="w-5 h-5" /> },
        { id: 'questions', label: 'Questions & Answers', icon: <MessageSquare className="w-5 h-5" /> },
      ],
    },
    {
      title: 'MY STUFF',
      items: [
        { id: 'coupons', label: 'My Coupons', icon: <Tag className="w-5 h-5" /> },
        { id: 'product-requests', label: 'My Product Requests', icon: <FileText className="w-5 h-5" /> },
        { id: 'wishlist', label: 'My Wishlist', icon: <Heart className="w-5 h-5" /> },
      ],
    },
    {
      title: 'FREQUENTLY VISITED',
      items: [
        { id: 'track-order', label: 'Track Order', icon: <Package className="w-5 h-5" /> },
        { id: 'help-center', label: 'Help Center', icon: <HelpCircle className="w-5 h-5" /> },
      ],
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'my-orders':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6">My Orders</h2>
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6">
                Start exploring our exquisite collection of silver jewelry
              </p>
              <Button onClick={() => navigate('/')} className="bg-foreground text-background hover:bg-foreground/90">
                Start Shopping
              </Button>
            </div>
          </div>
        );

      case 'edit-profile':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
            <div className="bg-card border border-border rounded-lg p-6 max-w-2xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    defaultValue={user?.displayName || ''}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-muted"
                    defaultValue={user?.email || ''}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <Button className="bg-foreground text-background hover:bg-foreground/90">
                    Save Changes
                  </Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'wishlist':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6">My Wishlist</h2>
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-6">
                Save your favorite items for later
              </p>
              <Button onClick={() => navigate('/wishlist')} className="bg-foreground text-background hover:bg-foreground/90">
                View Wishlist
              </Button>
            </div>
          </div>
        );

      case 'saved-addresses':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Saved Addresses</h2>
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No addresses saved</h3>
              <p className="text-muted-foreground mb-6">
                Add your delivery addresses for faster checkout
              </p>
              <Button className="bg-foreground text-background hover:bg-foreground/90">
                Add New Address
              </Button>
            </div>
          </div>
        );

      case 'coupons':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6">My Coupons</h2>
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <Tag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No coupons available</h3>
              <p className="text-muted-foreground">
                Check back later for exclusive offers
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              {sidebarSections.flatMap(s => s.items).find(i => i.id === activeSection)?.label || 'Coming Soon'}
            </h2>
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <p className="text-muted-foreground">This feature is coming soon</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="bg-card border border-border rounded-lg overflow-hidden sticky top-4">
              {/* User Profile Header */}
              <div className="p-6 border-b border-border bg-gradient-to-br from-primary/5 to-transparent">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-2xl font-semibold">
                    {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">Hello,</p>
                    <h3 className="font-semibold text-lg truncate">
                      {user?.displayName || user?.email?.split('@')[0] || 'Guest'}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-4">
                {sidebarSections.map((section, idx) => (
                  <div key={idx} className="mb-6 last:mb-0">
                    <h4 className="text-xs font-semibold text-muted-foreground mb-3 px-2">
                      {section.title}
                    </h4>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <motion.button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          whileHover={{ x: 4 }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                            activeSection === item.id
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          {item.icon}
                          <span className="flex-1 text-left text-sm">{item.label}</span>
                          {item.badge && (
                            <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                              {item.badge}
                            </span>
                          )}
                          {activeSection === item.id && (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Logout Button */}
                <div className="mt-6 pt-6 border-t border-border">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
          <div className="grid grid-cols-4 gap-1 p-2">
            <button
              onClick={() => setActiveSection('my-orders')}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg ${
                activeSection === 'my-orders' ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-xs">Orders</span>
            </button>
            <button
              onClick={() => setActiveSection('wishlist')}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg ${
                activeSection === 'wishlist' ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span className="text-xs">Wishlist</span>
            </button>
            <button
              onClick={() => setActiveSection('edit-profile')}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg ${
                activeSection === 'edit-profile' ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-xs">Profile</span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex flex-col items-center gap-1 p-3 rounded-lg text-muted-foreground"
            >
              <HelpCircle className="w-5 h-5" />
              <span className="text-xs">More</span>
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
