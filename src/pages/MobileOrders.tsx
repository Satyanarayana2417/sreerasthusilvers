import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeToUserOrders, Order } from '@/services/orderService';
import {
  Loader2,
  Package,
  ArrowLeft,
  Truck,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Home,
  User,
  Share2,
  MessageCircle,
  ChevronRight,
  Ban,
  Mail,
  Copy,
  X,
} from 'lucide-react';

const MobileOrders = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [selectedOrderTab, setSelectedOrderTab] = useState('current');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Subscribe to user orders
  useEffect(() => {
    if (!user) return;

    console.log('Setting up order subscription for user:', user.uid);
    setOrdersLoading(true);
    
    const unsubscribe = subscribeToUserOrders(
      user.uid,
      (fetchedOrders) => {
        console.log('📦 [MobileOrders] Real-time update received!');
        console.log('📦 [MobileOrders] Number of orders:', fetchedOrders.length);
        console.log('📦 [MobileOrders] Order details:', fetchedOrders.map(o => ({
          id: o.id,
          status: o.status,
          trackingId: o.trackingId,
          lastUpdated: o.lastUpdated
        })));
        setOrders(fetchedOrders);
        setOrdersLoading(false);
      },
      (error) => {
        console.error('Error fetching orders:', error);
        setOrdersLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up order subscription');
      unsubscribe();
    };
  }, [user]);

  // Sync selected order with updated orders data (for real-time updates in detail view)
  useEffect(() => {
    if (selectedOrder && orders.length > 0) {
      const updatedOrder = orders.find(order => order.id === selectedOrder.id);
      if (updatedOrder) {
        console.log('🔄 [MobileOrders] Syncing selected order with real-time data');
        setSelectedOrder(updatedOrder);
      }
    }
  }, [orders]);

  // Filter orders based on tab
  const filteredOrders = selectedOrderTab === 'current'
    ? orders.filter(order => ['pending', 'processing', 'shipped', 'outForDelivery'].includes(order.status))
    : orders;

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Format date
  const formatDate = (date: Date | { seconds: number; nanoseconds: number } | undefined) => {
    if (!date) return 'N/A';
    
    let jsDate: Date;
    if (date instanceof Date) {
      jsDate = date;
    } else if (typeof date === 'object' && 'seconds' in date) {
      jsDate = new Date(date.seconds * 1000);
    } else {
      return 'Invalid Date';
    }

    return jsDate.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Get status badge class - sophisticated palette
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'processing': return 'bg-orange-50 text-orange-700 border border-orange-200';
      case 'shipped': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'outForDelivery': return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
      case 'delivered': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border border-red-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-3.5 h-3.5" />;
      case 'processing': return <Package className="w-3.5 h-3.5" />;
      case 'shipped': return <Truck className="w-3.5 h-3.5" />;
      case 'outForDelivery': return <MapPin className="w-3.5 h-3.5" />;
      case 'delivered': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'cancelled': return <XCircle className="w-3.5 h-3.5" />;
      default: return <Package className="w-3.5 h-3.5" />;
    }
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'outForDelivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // Format payment method
  const formatPaymentMethod = (method: string) => {
    if (method === 'cod') return 'Cash On Delivery';
    if (method === 'online') return 'Online Payment';
    if (method === 'card') return 'Card Payment';
    return method.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

    return (
    <div className="min-h-screen bg-gray-50 pb-20" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <div className="sticky top-0 bg-white z-50 px-4 py-4 flex items-center shadow-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
        <button
          onClick={() => navigate('/account')}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="ml-3 text-lg font-semibold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>My Orders</h1>
      </div>

      {/* Order Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 pt-4 sticky top-[60px] z-40" style={{ fontFamily: "'Poppins', sans-serif" }}>
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
      <div className="p-4 space-y-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
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
              className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow bg-white"
              onClick={() => {
                setSelectedOrder(order);
                setShowOrderModal(true);
              }}
            >
              {/* Order Items Display */}
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{item.name}</h4>
                      <p className="text-xs text-gray-600">Price: {formatPrice(item.price)}</p>
                      <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${getStatusBadgeClass(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 block">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Detail Full Page */}
      <AnimatePresence>
        {showOrderModal && selectedOrder && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 z-10">
              <button
                onClick={() => setShowOrderModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>Order Details</h2>
            </div>

            {/* Content */}
            <div className="pb-24">
              {/* Tracking ID Banner */}
              <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                <p className="text-sm text-blue-700">
                  Order can be tracked by <span className="font-semibold">ORD-{selectedOrder.orderId}</span>
                  {selectedOrder.trackingId && (
                    <span className="block mt-1 text-xs">Tracking ID: {selectedOrder.trackingId}</span>
                  )}
                </p>
              </div>

              {/* Product Card */}
              <div className="bg-white px-4 py-4 border-b border-gray-100">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden border border-gray-100">
                    <img 
                      src={selectedOrder.items[0]?.image} 
                      alt={selectedOrder.items[0]?.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {selectedOrder.items.length > 1 
                        ? `${selectedOrder.items[0]?.name} +${selectedOrder.items.length - 1} more`
                        : selectedOrder.items[0]?.name
                      }
                    </h3>
                    <p className="text-base font-bold text-gray-900 mt-1">₹{selectedOrder.total.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Order Status Timeline */}
              <div className="bg-white px-4 py-5 border-b border-gray-100">
                <OrderStatusStepper status={selectedOrder.status} />
              </div>

              {/* Current Status Card */}
              <div className="bg-white px-4 py-4 border-b border-gray-100">
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    selectedOrder.status === 'delivered' ? 'bg-emerald-100' :
                    selectedOrder.status === 'cancelled' ? 'bg-red-100' :
                    'bg-blue-100'
                  }`}>
                    {selectedOrder.status === 'delivered' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : selectedOrder.status === 'cancelled' ? (
                      <XCircle className="w-5 h-5 text-red-600" />
                    ) : (
                      <Package className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>{getStatusLabel(selectedOrder.status)}</h4>
                    {selectedOrder.carrier && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {selectedOrder.carrier}
                      </p>
                    )}
                    <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {selectedOrder.status === 'pending' && 'Your order has been placed successfully'}
                      {selectedOrder.status === 'processing' && 'Package is being prepared for shipment'}
                      {selectedOrder.status === 'shipped' && 'Package has left the warehouse'}
                      {selectedOrder.status === 'outForDelivery' && 'Package is out for delivery'}
                      {selectedOrder.status === 'delivered' && 'Package has been delivered'}
                      {selectedOrder.status === 'cancelled' && 'Order has been cancelled'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(selectedOrder.updatedAt || selectedOrder.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Message */}
              {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                <div className="bg-amber-50 px-4 py-3 border-b border-amber-100">
                  <p className="text-sm text-amber-800">
                    {selectedOrder.status === 'shipped' || selectedOrder.status === 'outForDelivery'
                      ? "Yayy! your item is on the way. It will reach you soon."
                      : "Your order is being processed. We'll notify you once it's shipped."
                    }
                  </p>
                </div>
              )}

              {/* Delivery Executive Info */}
              {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium text-gray-800">Delivery Executive details</span> will be available once the order is out for delivery
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                <div className="bg-white px-4 py-4 flex gap-3 border-b border-gray-100">
                  <button className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                    <Ban className="w-4 h-4" />
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      const phoneNumber = '919819873745';
                      const message = encodeURIComponent(
                        `Hello! I need assistance regarding my order:\n\nOrder ID: ORD-${selectedOrder.orderId}\nProduct: ${selectedOrder.items[0]?.name}${selectedOrder.items.length > 1 ? ` +${selectedOrder.items.length - 1} more items` : ''}\nStatus: ${getStatusLabel(selectedOrder.status)}\n\nPlease help me with my product enquiry.`
                      );
                      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
                    }}
                    className="flex-1 py-2.5 px-4 bg-blue-50 border border-blue-200 rounded-lg text-sm font-medium text-blue-700 flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat with us
                  </button>
                </div>
              )}

              {/* Track Package Button */}
              {selectedOrder.trackingUrl && (
                <div className="bg-white px-4 py-3 border-b border-gray-100">
                  <a
                    href={selectedOrder.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl"
                  >
                    <Truck className="w-4 h-4" />
                    Track Package
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              {/* Delivery Details Section */}
              <div className="bg-white mt-2 border-t border-b border-gray-100">
                <h3 className="px-4 py-3 text-base font-semibold text-gray-900 border-b border-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>Delivery details</h3>
                
                {/* Delivery Address */}
                <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Home className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-600">Delivery Address</p>
                    <p className="text-xs text-gray-600 truncate">
                      {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>

                {/* Customer Info */}
                <div className="px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">
                      {selectedOrder.shippingAddress.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{selectedOrder.shippingAddress.fullName}</p>
                    <p className="text-xs text-gray-500">ORD-{selectedOrder.orderId}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </div>

              {/* Price Details Section */}
              <div className="bg-white mt-2 border-t border-b border-gray-100">
                <h3 className="px-4 py-3 text-base font-semibold text-gray-900 border-b border-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>Price details</h3>
                
                <div className="px-4 py-3 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Selling price</span>
                    <span className="text-gray-900">₹{selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount</span>
                      <span className="text-green-600">-₹{selectedOrder.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total fees</span>
                    <span className="text-gray-900">₹{(selectedOrder.deliveryCharge + selectedOrder.taxAmount).toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex justify-between">
                    <span className="text-base font-semibold text-blue-600">Total amount</span>
                    <span className="text-base font-bold text-gray-900">₹{selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Share Order Details */}
              <div className="bg-white mt-2 px-4 py-4 border-t border-b border-gray-100">
                <button 
                  onClick={async () => {
                    const orderReceipt = `
🛍️ *SREE RASTHU SILVERS - ORDER RECEIPT*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 *Order ID:* ORD-${selectedOrder.orderId}
📅 *Date:* ${formatDate(selectedOrder.createdAt)}
📌 *Status:* ${getStatusLabel(selectedOrder.status)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛒 *ITEMS ORDERED*

${selectedOrder.items.map((item, idx) => `${idx + 1}. ${item.name}
   Qty: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')}
   Subtotal: ₹${(item.quantity * item.price).toLocaleString('en-IN')}`).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 *PRICE DETAILS*

Selling Price: ₹${selectedOrder.subtotal.toLocaleString('en-IN')}${selectedOrder.discount > 0 ? `\nDiscount: -₹${selectedOrder.discount.toLocaleString('en-IN')}` : ''}
Total Fees: ₹${(selectedOrder.deliveryCharge + selectedOrder.taxAmount).toLocaleString('en-IN')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*TOTAL AMOUNT: ₹${selectedOrder.total.toLocaleString('en-IN')}*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💳 *Payment:* ${formatPaymentMethod(selectedOrder.paymentMethod)}

📍 *Delivery Address:*
${selectedOrder.shippingAddress.fullName}
${selectedOrder.shippingAddress.address}
${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.state}
PIN: ${selectedOrder.shippingAddress.pincode}
Mobile: ${selectedOrder.shippingAddress.mobile}
${selectedOrder.trackingId ? `\n🚚 *Tracking ID:* ${selectedOrder.trackingId}` : ''}${selectedOrder.carrier ? `\n🚛 *Carrier:* ${selectedOrder.carrier}` : ''}${selectedOrder.trackingUrl ? `\n📦 *Track Package:* ${selectedOrder.trackingUrl}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Thank you for shopping with us! 🎉

For support: +91 98198 73745
`;

                    try {
                      if (navigator.share) {
                        await navigator.share({
                          title: 'Order Receipt - Sree Rasthu Silvers',
                          text: orderReceipt,
                        });
                      } else {
                        // Fallback: Copy to clipboard
                        await navigator.clipboard.writeText(orderReceipt);
                        alert('Order details copied to clipboard!');
                      }
                    } catch (error) {
                      console.error('Error sharing:', error);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 text-sm text-gray-700 font-medium"
                >
                  <Share2 className="w-4 h-4" />
                  Send Order Details
                </button>
              </div>

              {/* Feedback */}
              <div className="bg-white mt-2 px-4 py-4 border-t border-b border-gray-100">
                <button className="w-full flex items-center justify-center gap-2 text-sm text-gray-500">
                  Did you find this page helpful?
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Menu Modal */}
      <AnimatePresence>
        {showShareMenu && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-end"
            onClick={() => setShowShareMenu(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="bg-white w-full rounded-t-3xl p-6 pb-8"
              style={{ fontFamily: "'Poppins', sans-serif" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Share Order Details</h3>
                <button
                  onClick={() => setShowShareMenu(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Share Options Grid */}
              <div className="grid grid-cols-4 gap-4">
                {/* WhatsApp */}
                <button
                  onClick={() => {
                    const orderReceipt = `🛍️ *SREE RASTHU SILVERS - ORDER RECEIPT*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n📦 *Order ID:* ORD-${selectedOrder.orderId}\n📅 *Date:* ${formatDate(selectedOrder.createdAt)}\n📌 *Status:* ${getStatusLabel(selectedOrder.status)}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🛒 *ITEMS ORDERED*\n\n${selectedOrder.items.map((item, idx) => `${idx + 1}. ${item.name}\n   Qty: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')}\n   Subtotal: ₹${(item.quantity * item.price).toLocaleString('en-IN')}`).join('\n\n')}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n💰 *PRICE DETAILS*\n\nSelling Price: ₹${selectedOrder.subtotal.toLocaleString('en-IN')}${selectedOrder.discount > 0 ? `\nDiscount: -₹${selectedOrder.discount.toLocaleString('en-IN')}` : ''}\nTotal Fees: ₹${(selectedOrder.deliveryCharge + selectedOrder.taxAmount).toLocaleString('en-IN')}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n*TOTAL AMOUNT: ₹${selectedOrder.total.toLocaleString('en-IN')}*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n💳 *Payment:* ${formatPaymentMethod(selectedOrder.paymentMethod)}\n\n📍 *Delivery Address:*\n${selectedOrder.shippingAddress.fullName}\n${selectedOrder.shippingAddress.address}\n${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.state}\nPIN: ${selectedOrder.shippingAddress.pincode}\nMobile: ${selectedOrder.shippingAddress.mobile}\n${selectedOrder.trackingId ? `\n🚚 *Tracking ID:* ${selectedOrder.trackingId}` : ''}${selectedOrder.carrier ? `\n🚛 *Carrier:* ${selectedOrder.carrier}` : ''}${selectedOrder.trackingUrl ? `\n📦 *Track Package:* ${selectedOrder.trackingUrl}` : ''}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nThank you for shopping with us! 🎉\n\nFor support: +91 98198 73745`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(orderReceipt)}`, '_blank');
                    setShowShareMenu(false);
                  }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                    <MessageCircle className="w-7 h-7 text-green-600" />
                  </div>
                  <span className="text-xs text-gray-700">WhatsApp</span>
                </button>

                {/* Gmail */}
                <button
                  onClick={() => {
                    const orderReceipt = `SREE RASTHU SILVERS - ORDER RECEIPT\n\nOrder ID: ORD-${selectedOrder.orderId}\nDate: ${formatDate(selectedOrder.createdAt)}\nStatus: ${getStatusLabel(selectedOrder.status)}\n\nITEMS ORDERED\n${selectedOrder.items.map((item, idx) => `${idx + 1}. ${item.name}\n   Qty: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')}\n   Subtotal: ₹${(item.quantity * item.price).toLocaleString('en-IN')}`).join('\n\n')}\n\nPRICE DETAILS\nSelling Price: ₹${selectedOrder.subtotal.toLocaleString('en-IN')}${selectedOrder.discount > 0 ? `\nDiscount: -₹${selectedOrder.discount.toLocaleString('en-IN')}` : ''}\nTotal Fees: ₹${(selectedOrder.deliveryCharge + selectedOrder.taxAmount).toLocaleString('en-IN')}\nTOTAL AMOUNT: ₹${selectedOrder.total.toLocaleString('en-IN')}\n\nPayment: ${formatPaymentMethod(selectedOrder.paymentMethod)}\n\nDelivery Address:\n${selectedOrder.shippingAddress.fullName}\n${selectedOrder.shippingAddress.address}\n${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.state}\nPIN: ${selectedOrder.shippingAddress.pincode}\nMobile: ${selectedOrder.shippingAddress.mobile}\n\nThank you for shopping with us!\n\nFor support: +91 98198 73745`;
                    window.open(`mailto:?subject=Order Receipt - ORD-${selectedOrder.orderId}&body=${encodeURIComponent(orderReceipt)}`, '_blank');
                    setShowShareMenu(false);
                  }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                    <Mail className="w-7 h-7 text-red-600" />
                  </div>
                  <span className="text-xs text-gray-700">Gmail</span>
                </button>

                {/* Instagram */}
                <button
                  onClick={async () => {
                    const orderReceipt = `🛍️ SREE RASTHU SILVERS - ORDER RECEIPT\n\n📦 Order: ORD-${selectedOrder.orderId}\n📅 ${formatDate(selectedOrder.createdAt)}\n💰 Total: ₹${selectedOrder.total.toLocaleString('en-IN')}\n\nFor support: +91 98198 73745`;
                    try {
                      if (navigator.share) {
                        await navigator.share({
                          title: 'Order Receipt',
                          text: orderReceipt,
                        });
                      } else {
                        await navigator.clipboard.writeText(orderReceipt);
                        alert('Copied to clipboard! Open Instagram and paste.');
                      }
                    } catch (error) {
                      console.error('Error:', error);
                    }
                    setShowShareMenu(false);
                  }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center">
                    <Share2 className="w-7 h-7 text-pink-600" />
                  </div>
                  <span className="text-xs text-gray-700">Instagram</span>
                </button>

                {/* Copy to Clipboard */}
                <button
                  onClick={async () => {
                    const orderReceipt = `🛍️ SREE RASTHU SILVERS - ORDER RECEIPT\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n📦 Order ID: ORD-${selectedOrder.orderId}\n📅 Date: ${formatDate(selectedOrder.createdAt)}\n📌 Status: ${getStatusLabel(selectedOrder.status)}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🛒 ITEMS ORDERED\n\n${selectedOrder.items.map((item, idx) => `${idx + 1}. ${item.name}\n   Qty: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')}\n   Subtotal: ₹${(item.quantity * item.price).toLocaleString('en-IN')}`).join('\n\n')}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n💰 PRICE DETAILS\n\nSelling Price: ₹${selectedOrder.subtotal.toLocaleString('en-IN')}${selectedOrder.discount > 0 ? `\nDiscount: -₹${selectedOrder.discount.toLocaleString('en-IN')}` : ''}\nTotal Fees: ₹${(selectedOrder.deliveryCharge + selectedOrder.taxAmount).toLocaleString('en-IN')}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nTOTAL AMOUNT: ₹${selectedOrder.total.toLocaleString('en-IN')}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n💳 Payment: ${formatPaymentMethod(selectedOrder.paymentMethod)}\n\n📍 Delivery Address:\n${selectedOrder.shippingAddress.fullName}\n${selectedOrder.shippingAddress.address}\n${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.state}\nPIN: ${selectedOrder.shippingAddress.pincode}\nMobile: ${selectedOrder.shippingAddress.mobile}\n${selectedOrder.trackingId ? `\n🚚 Tracking ID: ${selectedOrder.trackingId}` : ''}${selectedOrder.carrier ? `\n🚛 Carrier: ${selectedOrder.carrier}` : ''}${selectedOrder.trackingUrl ? `\n📦 Track: ${selectedOrder.trackingUrl}` : ''}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nThank you for shopping with us! 🎉\n\nFor support: +91 98198 73745`;
                    try {
                      await navigator.clipboard.writeText(orderReceipt);
                      alert('Order details copied to clipboard!');
                    } catch (error) {
                      console.error('Error:', error);
                    }
                    setShowShareMenu(false);
                  }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <Copy className="w-7 h-7 text-gray-600" />
                  </div>
                  <span className="text-xs text-gray-700">Copy</span>
                </button>

                {/* Facebook Messenger */}
                <button
                  onClick={async () => {
                    const orderReceipt = `Order Receipt - ORD-${selectedOrder.orderId}\nTotal: ₹${selectedOrder.total.toLocaleString('en-IN')}\n\nFor support: +91 98198 73745`;
                    try {
                      if (navigator.share) {
                        await navigator.share({
                          title: 'Order Receipt',
                          text: orderReceipt,
                        });
                      }
                    } catch (error) {
                      console.error('Error:', error);
                    }
                    setShowShareMenu(false);
                  }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <MessageCircle className="w-7 h-7 text-blue-600" />
                  </div>
                  <span className="text-xs text-gray-700">Messenger</span>
                </button>

                {/* SMS */}
                <button
                  onClick={() => {
                    const orderReceipt = `Order Receipt - ORD-${selectedOrder.orderId}\nDate: ${formatDate(selectedOrder.createdAt)}\nTotal: ₹${selectedOrder.total.toLocaleString('en-IN')}\n\nSree Rasthu Silvers\nSupport: +91 98198 73745`;
                    window.open(`sms:?body=${encodeURIComponent(orderReceipt)}`, '_blank');
                    setShowShareMenu(false);
                  }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                    <MessageCircle className="w-7 h-7 text-green-700" />
                  </div>
                  <span className="text-xs text-gray-700">SMS</span>
                </button>

                {/* Telegram */}
                <button
                  onClick={() => {
                    const orderReceipt = `🛍️ SREE RASTHU SILVERS - ORDER RECEIPT\n\n📦 Order: ORD-${selectedOrder.orderId}\n📅 ${formatDate(selectedOrder.createdAt)}\n💰 Total: ₹${selectedOrder.total.toLocaleString('en-IN')}\n\nFor support: +91 98198 73745`;
                    window.open(`https://t.me/share/url?text=${encodeURIComponent(orderReceipt)}`, '_blank');
                    setShowShareMenu(false);
                  }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center">
                    <Share2 className="w-7 h-7 text-sky-600" />
                  </div>
                  <span className="text-xs text-gray-700">Telegram</span>
                </button>

                {/* More (Native Share) */}
                <button
                  onClick={async () => {
                    const orderReceipt = `🛍️ SREE RASTHU SILVERS - ORDER RECEIPT\n\n📦 Order: ORD-${selectedOrder.orderId}\n📅 ${formatDate(selectedOrder.createdAt)}\n📌 Status: ${getStatusLabel(selectedOrder.status)}\n💰 Total: ₹${selectedOrder.total.toLocaleString('en-IN')}\n\nFor support: +91 98198 73745`;
                    try {
                      if (navigator.share) {
                        await navigator.share({
                          title: 'Order Receipt - Sree Rasthu Silvers',
                          text: orderReceipt,
                        });
                      }
                    } catch (error) {
                      console.error('Error:', error);
                    }
                    setShowShareMenu(false);
                  }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <Share2 className="w-7 h-7 text-gray-600" />
                  </div>
                  <span className="text-xs text-gray-700">More</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Order Status Stepper Component
const OrderStatusStepper = ({ status }: { status: string }) => {
  const steps = [
    { key: 'pending', label: 'Order\nPlaced' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'outForDelivery', label: 'Out for\nDelivery' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const getStepIndex = (currentStatus: string) => {
    const index = steps.findIndex(s => s.key === currentStatus);
    return index >= 0 ? index : 0;
  };

  const currentIndex = getStepIndex(status);
  const isCancelled = status === 'cancelled';

  return (
    <div className="flex items-start justify-between relative" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Progress Line Background */}
      <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-200 z-0" />
      
      {/* Progress Line Active */}
      <div 
        className={`absolute top-4 left-6 h-0.5 z-0 transition-all duration-500 ${isCancelled ? 'bg-red-500' : 'bg-blue-500'}`}
        style={{ 
          width: isCancelled ? '0%' : `calc(${(currentIndex / (steps.length - 1)) * 100}% - 12px)`,
        }}
      />
      
      {steps.map((step, index) => {
        const isCompleted = !isCancelled && index <= currentIndex;
        const isCurrent = !isCancelled && index === currentIndex;
        
        return (
          <div key={step.key} className="flex flex-col items-center relative z-10" style={{ width: '20%', fontFamily: "'Poppins', sans-serif" }}>
            {/* Step Circle */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              isCancelled 
                ? 'bg-gray-100 border-gray-300'
                : isCompleted 
                  ? 'bg-blue-500 border-blue-500' 
                  : 'bg-white border-gray-300'
            }`}>
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-white" />
              ) : (
                <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-blue-500' : 'bg-gray-300'}`} />
              )}
            </div>
            
            {/* Step Label */}
            <p className={`text-[10px] text-center mt-2 leading-tight whitespace-pre-line ${
              isCompleted ? 'text-blue-600 font-medium' : 'text-gray-400'
            }`}>
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default MobileOrders;
