import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeToUserOrders, Order } from '@/services/orderService';
import {
  Loader2,
  Package,
  ArrowLeft,
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
        setOrdersLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up order subscription');
      unsubscribe();
    };
  }, [user]);

  // Filter orders based on tab
  const filteredOrders = selectedOrderTab === 'current'
    ? orders.filter(order => ['pending', 'processing', 'shipped'].includes(order.status))
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

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'processing': return 'text-blue-600';
      case 'shipped': return 'text-purple-600';
      case 'delivered': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
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
      <div className="sticky top-0 bg-white z-50 px-4 py-4 flex items-center shadow-sm">
        <button
          onClick={() => navigate('/account')}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="ml-3 text-lg font-semibold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>My Orders</h1>
      </div>

      {/* Order Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 pt-4 sticky top-[60px] z-40">
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

      {/* Order Detail Modal */}
      <AnimatePresence>
        {showOrderModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowOrderModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto"
              style={{ fontFamily: "'Poppins', sans-serif" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
                <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>Order Details</h2>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Order ID & Status */}
                <div>
                  <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Order ID</p>
                  <p className="text-sm font-medium text-gray-900">#{selectedOrder.id.slice(0, 8).toUpperCase()}</p>
                  <div className="mt-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)} bg-gray-50`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-white rounded-lg flex-shrink-0 overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{item.name}</h4>
                          <p className="text-xs text-gray-600">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                          <p className="text-xs font-semibold text-gray-900 mt-1">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shippingAddress && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Shipping Address</h3>
                    <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-700">
                      <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                      <p className="mt-1">{selectedOrder.shippingAddress.address}</p>
                      {selectedOrder.shippingAddress.locality && (
                        <p>{selectedOrder.shippingAddress.locality}</p>
                      )}
                      <p>
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.pincode}
                      </p>
                      <p className="mt-1">Phone: {selectedOrder.shippingAddress.mobile}</p>
                    </div>
                  </div>
                )}

                {/* Payment & Total */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Payment Summary</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">{formatPrice(selectedOrder.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="text-gray-900">{formatPaymentMethod(selectedOrder.paymentMethod)}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200 flex justify-between font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Order Date */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Order placed on</p>
                  <p className="text-sm text-gray-900 mt-1">{formatDate(selectedOrder.createdAt)}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileOrders;
