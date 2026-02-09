import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Loader2, Shield, RotateCcw, Truck } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

const ShoppingCart = () => {
  const { items, isCartOpen, closeCart, updateQuantity, removeFromCart, subtotal, totalItems, loading } = useCart();
  const navigate = useNavigate();

  // Format price in Indian Rupees
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }, []);

  // Free delivery threshold
  const FREE_DELIVERY_THRESHOLD = 5000;
  const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 60;
  const taxAmount = Math.round(subtotal * 0.03); // 3% tax
  const total = subtotal + deliveryCharge + taxAmount;
  const remainingForFreeDelivery = FREE_DELIVERY_THRESHOLD - subtotal;
  const freeDeliveryProgress = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[9998]"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Slide-over drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] md:w-[440px] bg-white z-[9999] flex flex-col shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Cart"
          >
            {/* ─── HEADER ─── */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-900 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Shopping Cart
                </h2>
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-orange-500 rounded-full"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 text-gray-500 group-hover:text-gray-800 transition-colors" />
              </button>
            </div>

            {/* ─── FREE DELIVERY PROGRESS BAR ─── */}
            {items.length > 0 && remainingForFreeDelivery > 0 && (
              <div className="px-6 py-3 bg-amber-50/80 border-b border-amber-100/60">
                <div className="flex items-center gap-2 mb-1.5">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <p className="text-xs text-amber-800 font-medium">
                    Add {formatPrice(remainingForFreeDelivery)} more for <span className="font-bold">FREE delivery</span>
                  </p>
                </div>
                <div className="w-full h-1.5 rounded-full bg-amber-200/60 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${freeDeliveryProgress}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}

            {items.length > 0 && remainingForFreeDelivery <= 0 && (
              <div className="px-6 py-3 bg-green-50/80 border-b border-green-100/60">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-green-600" />
                  <p className="text-xs text-green-800 font-semibold">
                    You've unlocked FREE delivery! 🎉
                  </p>
                </div>
              </div>
            )}

            {/* ─── CART CONTENT ─── */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {loading ? (
                /* Loading State */
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-2 border-gray-100" />
                    <Loader2 className="w-16 h-16 text-orange-500 animate-spin absolute inset-0" />
                  </div>
                  <p className="text-sm text-gray-400 mt-5 font-medium tracking-wide">Loading your cart...</p>
                </div>
              ) : items.length === 0 ? (
                /* Empty State */
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex flex-col items-center justify-center h-full text-center px-8 py-16"
                >
                  <div className="relative mb-8">
                    <div className="w-28 h-28 bg-gradient-to-br from-orange-50 to-amber-50 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-12 h-12 text-orange-300" strokeWidth={1.5} />
                    </div>
                    <motion.div
                      className="absolute -top-1 -right-1 w-8 h-8 bg-orange-100 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Your cart is empty
                  </h3>
                  <p className="text-sm text-gray-400 mb-8 max-w-[260px] leading-relaxed">
                    Discover our exquisite collection of handcrafted silver jewelry.
                  </p>
                  <button
                    onClick={closeCart}
                    className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 active:scale-[0.97] transition-all duration-200 shadow-lg shadow-gray-900/20"
                  >
                    Continue Shopping
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </motion.div>
              ) : (
                /* Cart Items */
                <div className="px-6 py-4 space-y-0 divide-y divide-gray-100">
                  <AnimatePresence mode="popLayout">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 80, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
                        transition={{ duration: 0.25, delay: index * 0.04 }}
                        className="flex gap-4 py-5 group"
                      >
                        {/* Product Image */}
                        <div className="relative w-[88px] h-[88px] bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            loading="lazy"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 pr-1">
                                {item.name}
                              </h4>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 text-gray-300 transition-all duration-200 flex-shrink-0 -mt-0.5"
                                aria-label={`Remove ${item.name}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Category tag */}
                            {item.category && (
                              <span className="inline-block text-[10px] uppercase tracking-widest text-gray-400 mt-1">
                                {item.category}
                              </span>
                            )}
                          </div>

                          {/* Bottom row: Price + Quantity */}
                          <div className="flex items-end justify-between mt-2.5">
                            <div>
                              <motion.span
                                key={item.price * item.quantity}
                                initial={{ opacity: 0.6, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-base font-bold text-gray-900 block"
                              >
                                {formatPrice(item.price * item.quantity)}
                              </motion.span>
                              {item.quantity > 1 && (
                                <span className="text-[11px] text-gray-400">
                                  {formatPrice(item.price)} each
                                </span>
                              )}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center h-8 rounded-full border border-gray-200 bg-gray-50/80">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-l-full hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3 text-gray-600" />
                              </button>
                              <motion.span
                                key={item.quantity}
                                initial={{ scale: 0.8, opacity: 0.5 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-8 text-center text-xs font-semibold text-gray-800 select-none"
                              >
                                {item.quantity}
                              </motion.span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-r-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3 text-gray-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* ─── FOOTER: SUMMARY + ACTIONS ─── */}
            {items.length > 0 && !loading && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="border-t border-gray-100 bg-white px-6 py-5 space-y-4"
              >
                {/* Price breakdown */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                    <span className="text-gray-700 font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Delivery</span>
                    <span className={deliveryCharge === 0 ? 'text-green-600 font-medium' : 'text-gray-700 font-medium'}>
                      {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Tax (3%)</span>
                    <span className="text-gray-700 font-medium">{formatPrice(taxAmount)}</span>
                  </div>
                  <div className="h-px bg-gray-100 my-1" />
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-semibold text-gray-900">Total</span>
                    <motion.span
                      key={total}
                      initial={{ opacity: 0.5, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-xl font-bold text-gray-900"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {formatPrice(total)}
                    </motion.span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-2.5 pt-1">
                  <button
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-gray-900/15"
                    onClick={() => {
                      closeCart();
                      navigate('/checkout');
                    }}
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    className="w-full py-3 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition-all duration-200"
                    onClick={closeCart}
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-5 pt-2">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Shield className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-medium tracking-wide uppercase">Secure</span>
                  </div>
                  <div className="w-px h-3 bg-gray-200" />
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-medium tracking-wide uppercase">7-Day Returns</span>
                  </div>
                  <div className="w-px h-3 bg-gray-200" />
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Truck className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-medium tracking-wide uppercase">Insured</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;
