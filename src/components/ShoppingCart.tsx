import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const ShoppingCart = () => {
  const { items, isCartOpen, closeCart, updateQuantity, removeFromCart, subtotal, totalItems, loading } = useCart();
  const navigate = useNavigate();

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate estimated delivery charge (free for orders above ₹5000)
  const deliveryCharge = subtotal >= 5000 ? 0 : 200;
  const total = subtotal + deliveryCharge;

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-sm flex flex-col p-0 overflow-hidden"
        aria-describedby="cart-description"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Shopping Cart
            </SheetTitle>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {totalItems > 0 && (
            <p id="cart-description" className="text-sm text-muted-foreground mt-1">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          )}
          {totalItems === 0 && (
            <p id="cart-description" className="text-sm text-muted-foreground mt-1 sr-only">
              Your shopping cart for Sree Rasthu Silvers luxury silver jewelry
            </p>
          )}
        </SheetHeader>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {loading ? (
            // Loading State
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading your cart...</p>
            </div>
          ) : items.length === 0 ? (
            // Empty State
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center py-12"
            >
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Your cart is empty
              </h3>
              <p className="text-muted-foreground mb-8 max-w-xs">
                Explore our exquisite collection of silver jewelry and add items to your cart.
              </p>
              <Button
                onClick={closeCart}
                className="bg-foreground text-background hover:bg-foreground/90 px-8 py-6 text-base font-medium rounded-full"
              >
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          ) : (
            // Cart Items
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex gap-4 group"
                  >
                    {/* Product Image */}
                    <div className="relative w-24 h-24 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-medium text-base leading-tight line-clamp-2">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors flex-shrink-0"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Additional Info */}
                      {(item.category || item.weight || item.purity) && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {item.category && (
                            <span className="text-xs text-muted-foreground">
                              {item.category}
                            </span>
                          )}
                          {item.weight && (
                            <span className="text-xs text-muted-foreground">
                              • {item.weight}
                            </span>
                          )}
                          {item.purity && (
                            <span className="text-xs text-muted-foreground">
                              • {item.purity}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Price and Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-foreground">
                          {formatPrice(item.price * item.quantity)}
                        </span>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 bg-muted rounded-full px-1 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-background rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-medium min-w-[1.5rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-background rounded-full transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Unit Price */}
                      {item.quantity > 1 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatPrice(item.price)} each
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer - Checkout Section */}
        {items.length > 0 && (
          <div className="border-t border-border bg-background/50 backdrop-blur-sm px-6 py-5 space-y-4">
            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full bg-foreground text-background hover:bg-foreground/90 py-6 text-base font-semibold rounded-full shadow-luxury-md hover:shadow-luxury-lg transition-all duration-300"
                onClick={() => {
                  closeCart();
                  navigate('/checkout');
                }}
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <Button
                variant="outline"
                className="w-full border-2 border-foreground/20 hover:bg-muted py-6 text-base font-medium rounded-full"
                onClick={closeCart}
              >
                Continue Shopping
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-4 pt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>7-Day Returns</span>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCart;
