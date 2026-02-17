import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Loader2, 
  Truck,
  MapPin,
  Clock,
  Phone,
  Navigation,
  User,
  X,
  LogOut,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Inbox,
  IndianRupee,
  ExternalLink,
  LayoutDashboard,
  History,
  Settings,
  HelpCircle,
  Menu,
  Bell,
  ShieldCheck,
  KeyRound,
  PackageCheck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  subscribeToDeliveryBoyOrders, 
  Order,
  updateDeliveryStatusByDeliveryBoy,
  acceptOrderByDeliveryBoy,
  startDelivery,
  verifyDeliveryOTP
} from '@/services/orderService';
import { toast } from 'sonner';

// Status configuration for badges - Light theme premium colors
const statusConfig: Record<Order['status'], { label: string; color: string; bgColor: string; borderColor: string; dotColor: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'text-amber-700', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', dotColor: 'bg-amber-500', icon: Clock },
  processing: { label: 'Processing', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', dotColor: 'bg-blue-500', icon: Package },
  shipped: { label: 'Assigned', color: 'text-violet-700', bgColor: 'bg-violet-50', borderColor: 'border-violet-200', dotColor: 'bg-violet-500', icon: Truck },
  assigned: { label: 'Assigned', color: 'text-violet-700', bgColor: 'bg-violet-50', borderColor: 'border-violet-200', dotColor: 'bg-violet-500', icon: Truck },
  picked: { label: 'Picked Up', color: 'text-indigo-700', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200', dotColor: 'bg-indigo-500', icon: PackageCheck },
  outForDelivery: { label: 'Out for Delivery', color: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', dotColor: 'bg-orange-500', icon: Truck },
  delivered: { label: 'Delivered', color: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', dotColor: 'bg-emerald-500', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'text-rose-700', bgColor: 'bg-rose-50', borderColor: 'border-rose-200', dotColor: 'bg-rose-500', icon: AlertCircle },
  returnRequested: { label: 'Return Requested', color: 'text-amber-700', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', dotColor: 'bg-amber-500', icon: AlertCircle },
  returnScheduled: { label: 'Return Scheduled', color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', dotColor: 'bg-purple-500', icon: Truck },
  returned: { label: 'Returned', color: 'text-gray-700', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', dotColor: 'bg-gray-500', icon: PackageCheck },
};

const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile, logout, isDelivery } = useAuth();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  // Subscribe to orders assigned to this delivery boy
  useEffect(() => {
    if (!user || !isDelivery) {
      navigate('/delivery');
      return;
    }

    const unsubscribe = subscribeToDeliveryBoyOrders(
      user.uid,
      (fetchedOrders) => {
        setOrders(fetchedOrders);
        setLoading(false);
        setRefreshing(false);
        
        // Check for new orders (compare with previous count)
        const activeOrders = fetchedOrders.filter(o => 
          o.status !== 'delivered' && o.status !== 'cancelled'
        );
        if (activeOrders.length > orders.length && orders.length > 0) {
          toast.success('New order assigned!', {
            description: 'You have a new delivery assignment.',
          });
        }
      },
      (error) => {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
        setLoading(false);
        setRefreshing(false);
      }
    );

    return () => unsubscribe();
  }, [user, isDelivery, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      // Clear any stored data
      localStorage.removeItem('delivery_remembered_email');
      toast.success('Logged out successfully');
      navigate('/delivery', { replace: true });
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  // Accept order handler
  const handleAcceptOrder = async (orderId: string) => {
    if (!user) return;
    setUpdatingStatus(orderId);
    try {
      await acceptOrderByDeliveryBoy(orderId, user.uid);
      toast.success('Order accepted! Ready to start delivery.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to accept order');
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Start delivery handler (generates OTP)
  const handleStartDelivery = async (orderId: string) => {
    if (!user) return;
    setUpdatingStatus(orderId);
    try {
      await startDelivery(orderId, user.uid);
      toast.success('Delivery started! Ask customer for OTP.', {
        description: 'OTP has been sent to the customer.',
        duration: 5000,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to start delivery');
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Verify OTP handler
  const handleVerifyOTP = async (orderId: string, otp: string) => {
    if (!user) return;
    setVerifyingOTP(true);
    try {
      const result = await verifyDeliveryOTP(orderId, otp, user.uid);
      if (result.success) {
        toast.success(result.message, {
          icon: '🎉',
          duration: 5000,
        });
        setShowDetails(false);
        setSelectedOrder(null);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error('Failed to verify OTP. Please try again.');
    } finally {
      setVerifyingOTP(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingStatus(orderId);
    try {
      await updateDeliveryStatusByDeliveryBoy(orderId, newStatus);
      toast.success(`Order marked as ${statusConfig[newStatus].label}`);
      setShowDetails(false);
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // The refresh is automatic via onSnapshot, this just shows visual feedback
    setTimeout(() => setRefreshing(false), 1000);
  };

  const openPhoneDialer = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const openMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    // Try to open in maps app (works on both iOS and Android)
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Separate orders by active and completed
  const activeOrders = orders.filter(o => 
    o.status !== 'delivered' && o.status !== 'cancelled'
  );
  const completedOrders = orders.filter(o => 
    o.status === 'delivered' || o.status === 'cancelled'
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-white to-amber-50/30">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-5 mx-auto shadow-sm">
              <Truck className="h-8 w-8 text-amber-600" />
            </div>
          </div>
          <Loader2 className="h-5 w-5 animate-spin text-amber-600 mx-auto mb-3" />
          <p className="text-stone-400 text-sm font-medium">Loading deliveries...</p>
        </motion.div>
      </div>
    );
  }

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Truck, label: 'Active', count: activeOrders.length },
    { icon: History, label: 'Completed', count: completedOrders.length },
    { icon: Bell, label: 'Notifications', count: 0 },
    { icon: Settings, label: 'Settings' },
    { icon: HelpCircle, label: 'Help & Support' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/20">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-stone-100 transform transition-transform duration-300 ease-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-stone-800 text-sm">Sree Rasthu</h1>
                <p className="text-xs text-stone-400">Delivery Partner</p>
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div className="p-4 mx-4 mt-4 rounded-2xl bg-gradient-to-br from-stone-50 to-stone-100/50 border border-stone-100">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                  {(userProfile?.name || userProfile?.username || 'D')[0].toUpperCase()}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-800 truncate">
                  {userProfile?.name || userProfile?.username || 'Partner'}
                </p>
                <p className="text-xs text-stone-400">Online</p>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarItems.map((item, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  item.active 
                    ? 'bg-amber-50 text-amber-700 font-medium' 
                    : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1 text-sm">{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    item.active ? 'bg-amber-200 text-amber-800' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {item.count}
                  </span>
                )}
              </motion.button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-stone-100">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-all"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Logout</span>
            </motion.button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-stone-100">
          <div className="px-4 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl bg-stone-50 text-stone-500 hover:bg-stone-100 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </motion.button>
              <div>
                <h1 className="text-xl font-semibold text-stone-800">Dashboard</h1>
                <p className="text-sm text-stone-400">Welcome back, {userProfile?.name?.split(' ')[0] || 'Partner'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleRefresh}
                className={`p-2.5 rounded-xl bg-stone-50 text-stone-500 hover:bg-stone-100 transition-all ${refreshing ? 'animate-spin' : ''}`}
              >
                <RefreshCw className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="relative p-2.5 rounded-xl bg-stone-50 text-stone-500 hover:bg-stone-100 transition-all"
              >
                <Bell className="h-5 w-5" />
                {activeOrders.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {activeOrders.length}
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="p-4 lg:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-amber-600" />
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
              </div>
              <p className="text-2xl font-bold text-stone-800">{activeOrders.length}</p>
              <p className="text-xs text-stone-400 mt-1">Active Deliveries</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-stone-800">{completedOrders.length}</p>
              <p className="text-xs text-stone-400 mt-1">Completed Today</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                  <IndianRupee className="h-5 w-5 text-violet-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-stone-800">
                {formatCurrency(orders.reduce((sum, o) => sum + o.total, 0)).replace('₹', '₹ ')}
              </p>
              <p className="text-xs text-stone-400 mt-1">Total Value</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-rose-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-stone-800">{orders.filter(o => o.status === 'outForDelivery').length}</p>
              <p className="text-xs text-stone-400 mt-1">Out for Delivery</p>
            </motion.div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 bg-stone-100/50 p-1.5 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'active' 
                  ? 'bg-white text-stone-800 shadow-sm' 
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Active ({activeOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'completed' 
                  ? 'bg-white text-stone-800 shadow-sm' 
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Completed ({completedOrders.length})
            </button>
          </div>

          {/* Orders Content */}
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 px-4"
            >
              <div className="w-20 h-20 rounded-2xl bg-stone-100 flex items-center justify-center mb-5">
                <Inbox className="h-10 w-10 text-stone-300" />
              </div>
              <h2 className="text-lg font-semibold text-stone-700 mb-2">No deliveries yet</h2>
              <p className="text-stone-400 text-center max-w-xs text-sm">
                New assignments will appear here when assigned by admin
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-50 text-amber-700 font-medium hover:bg-amber-100 transition-all"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="text-sm">Refresh</span>
              </motion.button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {activeTab === 'active' ? (
                activeOrders.length > 0 ? (
                  activeOrders.map((order, index) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      index={index}
                      onViewDetails={() => {
                        setSelectedOrder(order);
                        setShowDetails(true);
                      }}
                      formatCurrency={formatCurrency}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4 mx-auto">
                      <CheckCircle2 className="h-8 w-8 text-stone-300" />
                    </div>
                    <p className="text-stone-500">All caught up! No active deliveries.</p>
                  </div>
                )
              ) : (
                completedOrders.length > 0 ? (
                  completedOrders.map((order, index) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      index={index}
                      onViewDetails={() => {
                        setSelectedOrder(order);
                        setShowDetails(true);
                      }}
                      formatCurrency={formatCurrency}
                      isCompleted
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4 mx-auto">
                      <History className="h-8 w-8 text-stone-300" />
                    </div>
                    <p className="text-stone-500">No completed deliveries yet.</p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showDetails && selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => {
              setShowDetails(false);
              setSelectedOrder(null);
            }}
            onAcceptOrder={handleAcceptOrder}
            onStartDelivery={handleStartDelivery}
            onVerifyOTP={handleVerifyOTP}
            updatingStatus={updatingStatus}
            verifyingOTP={verifyingOTP}
            openPhoneDialer={openPhoneDialer}
            openMaps={openMaps}
            formatCurrency={formatCurrency}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Order Card Component
interface OrderCardProps {
  order: Order;
  index: number;
  onViewDetails: () => void;
  formatCurrency: (amount: number) => string;
  isCompleted?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({ 
  order, 
  index, 
  onViewDetails, 
  formatCurrency,
  isCompleted = false 
}) => {
  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-all ${isCompleted ? 'opacity-70' : ''}`}
    >
      <div className="p-5">
        {/* Top row: Order ID & Status */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-1">Order ID</p>
            <p className="font-mono text-lg font-bold text-stone-800">#{order.orderId}</p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${status.bgColor} ${status.borderColor}`}>
            <div className={`w-2 h-2 rounded-full ${status.dotColor}`} />
            <span className={`text-xs font-semibold ${status.color}`}>{status.label}</span>
          </div>
        </div>

        {/* Customer & Address */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center shrink-0">
              <User className="h-5 w-5 text-stone-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-stone-700 truncate">{order.shippingAddress.fullName}</p>
              <p className="text-xs text-stone-400 truncate">{order.shippingAddress.mobile}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center shrink-0">
              <MapPin className="h-5 w-5 text-stone-400" />
            </div>
            <p className="text-sm text-stone-500 leading-relaxed">
              {order.shippingAddress.locality || order.shippingAddress.city}, {order.shippingAddress.state}
            </p>
          </div>
        </div>

        {/* Bottom row: Amount & Action */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-0.5">Amount</p>
            <p className="text-xl font-bold text-amber-600">{formatCurrency(order.total)}</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onViewDetails}
            className="flex items-center gap-2 px-5 py-3 bg-stone-800 text-white rounded-xl text-sm font-medium transition-all hover:bg-stone-900"
          >
            View Details
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Order Details Modal Component
interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onAcceptOrder: (orderId: string) => void;
  onStartDelivery: (orderId: string) => void;
  onVerifyOTP: (orderId: string, otp: string) => void;
  updatingStatus: string | null;
  verifyingOTP: boolean;
  openPhoneDialer: (phone: string) => void;
  openMaps: (address: string) => void;
  formatCurrency: (amount: number) => string;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  onAcceptOrder,
  onStartDelivery,
  onVerifyOTP,
  updatingStatus,
  verifyingOTP,
  openPhoneDialer,
  openMaps,
  formatCurrency,
}) => {
  const status = statusConfig[order.status];
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');

  const fullAddress = `${order.shippingAddress.address}, ${order.shippingAddress.locality || ''} ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`;

  const isUpdating = updatingStatus === order.id;

  const handleOTPChange = (value: string) => {
    // Only allow numbers and max 4 digits
    const cleanValue = value.replace(/\D/g, '').slice(0, 4);
    setOtpInput(cleanValue);
    setOtpError('');
  };

  const handleVerifyOTP = () => {
    if (otpInput.length !== 4) {
      setOtpError('Please enter 4-digit OTP');
      return;
    }
    onVerifyOTP(order.id, otpInput);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 sm:flex sm:items-center sm:justify-center sm:bg-stone-900/30 sm:backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-full h-full sm:h-auto sm:max-w-lg bg-white sm:rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-100 sticky top-0 bg-white z-10">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-100 text-stone-500 hover:bg-stone-200 transition-all"
          >
            <X className="h-5 w-5" />
          </motion.button>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">Order Details</p>
            <p className="font-mono text-base font-bold text-stone-800">#{order.orderId}</p>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100vh-68px)] sm:max-h-[70vh]">
          <div className="px-4 sm:px-6 py-4 sm:py-5">
          {/* Status Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border ${status.bgColor} ${status.borderColor} mb-6`}>
            <div className={`w-2 h-2 rounded-full ${status.dotColor}`} />
            <span className={`font-semibold ${status.color}`}>{status.label}</span>
          </div>

          {/* Customer Info */}
          <div className="mb-6">
            <h3 className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-4">
              Customer Information
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <User className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-stone-800 font-semibold">{order.shippingAddress.fullName}</p>
                <p className="text-sm text-stone-400">{order.userName}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 mb-6">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => openPhoneDialer(order.shippingAddress.mobile)}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-semibold transition-all hover:bg-emerald-100"
            >
              <Phone className="h-5 w-5" />
              Call Customer
            </motion.button>
            {order.shippingAddress.alternativePhone && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => openPhoneDialer(order.shippingAddress.alternativePhone!)}
                className="w-14 flex items-center justify-center bg-stone-50 border border-stone-200 text-stone-600 rounded-xl transition-all hover:bg-stone-100"
              >
                <Phone className="h-5 w-5" />
              </motion.button>
            )}
          </div>

          {/* Delivery Address */}
          <div className="mb-6">
            <h3 className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-4">
              Delivery Address
            </h3>
            <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4 space-y-2">
              <p className="text-stone-800 font-medium">{order.shippingAddress.address}</p>
              {order.shippingAddress.locality && (
                <p className="text-stone-600">{order.shippingAddress.locality}</p>
              )}
              <p className="text-stone-500">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              {order.shippingAddress.landmark && (
                <p className="text-stone-400 text-sm italic">
                  Near: {order.shippingAddress.landmark}
                </p>
              )}
              <div className="pt-4">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openMaps(fullAddress)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl font-semibold transition-all hover:bg-blue-100"
                >
                  <Navigation className="h-5 w-5" />
                  Open in Maps
                  <ExternalLink className="h-4 w-4 ml-1 opacity-50" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-4">
              Items ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 bg-stone-50 border border-stone-100 rounded-xl p-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover border border-stone-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-stone-800 text-sm font-medium truncate">{item.name}</p>
                    <p className="text-stone-400 text-xs">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-amber-600 font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4 mb-6">
            <h3 className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold mb-4">
              Payment Summary
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Subtotal</span>
                <span className="text-stone-700">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Delivery</span>
                <span className="text-stone-700">{formatCurrency(order.deliveryCharge)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Discount</span>
                  <span className="text-emerald-600">-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                <span className="text-stone-800 font-semibold">Total</span>
                <span className="text-amber-600 font-bold text-xl">{formatCurrency(order.total)}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-200 flex items-center gap-2">
              <span className="text-stone-400 text-xs">Payment Method:</span>
              <span className="text-stone-600 text-xs font-medium">{order.paymentMethod}</span>
            </div>
          </div>

          {/* Footer Actions */}
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <div className="px-4 sm:px-6 pb-5 space-y-4">
            {/* Step 1: Accept Order (shipped/assigned -> picked) */}
            {(order.status === 'shipped' || order.status === 'assigned') && (
              <Button
                onClick={() => onAcceptOrder(order.id)}
                disabled={isUpdating}
                className="w-full h-14 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold rounded-xl text-base shadow-lg shadow-indigo-500/20"
              >
                {isUpdating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <PackageCheck className="h-5 w-5 mr-2" />
                    Accept & Pick Up
                  </>
                )}
              </Button>
            )}

            {/* Step 2: Start Delivery (picked -> outForDelivery) */}
            {order.status === 'picked' && (
              <Button
                onClick={() => onStartDelivery(order.id)}
                disabled={isUpdating}
                className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl text-base shadow-lg shadow-amber-500/20"
              >
                {isUpdating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Truck className="h-5 w-5 mr-2" />
                    Start Delivery
                  </>
                )}
              </Button>
            )}

            {/* Step 3: OTP Verification (outForDelivery -> delivered) */}
            {order.status === 'outForDelivery' && (
              <div className="space-y-3">
                {/* OTP Input - FIRST for better visibility */}
                <div className="space-y-2">
                  <label className="text-xs sm:text-[10px] uppercase tracking-widest text-stone-400 font-semibold">
                    Enter Customer's Delivery OTP
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      value={otpInput}
                      onChange={(e) => handleOTPChange(e.target.value)}
                      placeholder="••••"
                      className={`flex-1 h-12 sm:h-14 px-3 bg-white border-2 rounded-lg text-center text-xl sm:text-2xl font-bold tracking-[0.5em] text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-0 transition-colors ${
                        otpError ? 'border-rose-300 focus:border-rose-400' : 'border-amber-300 focus:border-amber-500'
                      }`}
                    />
                  </div>
                  {otpError && (
                    <p className="text-rose-500 text-xs font-medium">{otpError}</p>
                  )}
                </div>

                {/* Verify Button - Full width, prominent */}
                <Button
                  onClick={handleVerifyOTP}
                  disabled={verifyingOTP || otpInput.length !== 4}
                  className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold rounded-lg text-sm sm:text-base shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {verifyingOTP ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="h-5 w-5 mr-2" />
                      <span className="hidden sm:inline">Verify OTP & Complete Delivery</span>
                      <span className="sm:hidden">Verify & Complete</span>
                    </>
                  )}
                </Button>

                {/* OTP Info Banner - moved to bottom */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-3.5 w-3.5 text-amber-600" />
                    <p className="text-amber-700 text-xs">
                      Ask the customer to share their OTP from the Account page.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

          {/* Delivered Success Badge */}
          {order.status === 'delivered' && order.otp_verified && (
            <div className="px-4 sm:px-6 pb-5">
              <div className="flex items-center gap-3 justify-center p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Delivered & OTP Verified</span>
              </div>
            </div>
          )}
        </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeliveryDashboard;
