import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, Tag, Gift, ChevronDown, Shield } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal } = useCart();
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [showOffers, setShowOffers] = useState(false);

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate delivery charge (free for orders above ₹5000)
  const deliveryCharge = subtotal >= 5000 ? 0 : 200;
  const total = subtotal + deliveryCharge;

  // Sample address (would come from user profile in real app)
  const addresses = [
    {
      id: '1',
      name: 'Sns Narayana Chodisetti',
      pincode: '533005',
      address: 'D No.3-25, Geetha Patashala Road, Opp.Ambedkar Statue',
      area: 'Thimmaparam',
      city: 'Kakinada',
    },
  ];

  const offers = [
    '10% Instant Discount On Canara Bank Credit Card on min spend of ₹3,500',
    'Flat ₹500 Off on First Order',
    'Free Silver Polishing Kit with orders above ₹10,000',
  ];

  const donationAmounts = [10, 20, 50, 100];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Cart</span>
        </button>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <span className="ml-2 font-medium text-primary">BAG</span>
          </div>
          <div className="w-16 h-0.5 bg-border mx-2"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center text-sm">
              2
            </div>
            <span className="ml-2 text-muted-foreground">ADDRESS</span>
          </div>
          <div className="w-16 h-0.5 bg-border mx-2"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center text-sm">
              3
            </div>
            <span className="ml-2 text-muted-foreground">PAYMENT</span>
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-600">100% SECURE</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Address & Offers */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Deliver to: {addresses[0].name}, {addresses[0].pincode}
                </h2>
                <Button variant="outline" className="text-primary border-primary hover:bg-primary/5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  CHANGE ADDRESS
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {addresses[0].address}, {addresses[0].area}, {addresses[0].city}
              </p>
            </div>

            {/* Available Offers */}
            <div className="bg-card border border-border rounded-lg p-6">
              <button
                onClick={() => setShowOffers(!showOffers)}
                className="flex items-center justify-between w-full mb-4"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Tag className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Available Offers</h2>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${showOffers ? 'rotate-180' : ''}`}
                />
              </button>

              {showOffers && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3"
                >
                  {offers.map((offer, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-green-600 font-semibold">•</span>
                      <p className="text-muted-foreground">{offer}</p>
                    </div>
                  ))}
                  <Button variant="link" className="text-primary p-0 h-auto font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Show More
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Cart Items */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {items.length}/{items.length} ITEMS SELECTED
                </h2>
                <div className="flex gap-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <button className="text-sm text-muted-foreground hover:text-foreground">
                    REMOVE
                  </button>
                  <button className="text-sm text-muted-foreground hover:text-foreground">
                    MOVE TO WISHLIST
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <h3 className="font-medium mb-1">{item.name}</h3>
                      {item.category && (
                        <p className="text-sm text-muted-foreground mb-2">
                          Sold by: Sree Rasthu Silvers
                        </p>
                      )}
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{formatPrice(item.price)}</span>
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(item.price * 1.3)}
                        </span>
                        <span className="text-sm text-green-600 font-medium">
                          23% OFF
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <select className="border border-border rounded px-2 py-1 text-sm">
                          <option>Qty: {item.quantity}</option>
                        </select>
                        <span className="text-sm text-muted-foreground">
                          1 left
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                          </svg>
                          <span className="text-muted-foreground">7 days</span>
                        </div>
                        <span className="text-muted-foreground">return available</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>SUPPORT TRANSFORMATIVE SOCIAL WORK IN INDIA</h3>
              </div>
              <div className="flex items-center gap-2 mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm text-muted-foreground">
                  Donate and make a difference
                </span>
              </div>
              <div className="flex gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {donationAmounts.map((amount) => (
                  <button
                    key={amount}
                    className="px-4 py-2 border border-border rounded-full text-sm hover:border-primary hover:text-primary transition-colors"
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
              <button className="text-sm text-primary mt-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Know More</button>
            </div>
          </div>

          {/* Right Column - Coupons & Price Details */}
          <div className="space-y-6">
            {/* Coupons */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5" />
                <h3 className="font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>Apply Coupons</h3>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                />
                <Button variant="outline" className="text-primary border-primary" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  APPLY
                </Button>
              </div>
            </div>

            {/* Price Details */}
            <div className="bg-card border border-border rounded-lg p-6 sticky top-4">
              <h3 className="font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>PRICE DETAILS ({items.length} Item{items.length > 1 ? 's' : ''})</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total MRP</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className={deliveryCharge === 0 ? 'text-green-600' : ''}>
                    {deliveryCharge === 0 ? (
                      <span className="flex items-center gap-1">
                        <span className="line-through text-muted-foreground">₹200</span>
                        <span className="font-medium">FREE</span>
                      </span>
                    ) : (
                      formatPrice(deliveryCharge)
                    )}
                  </span>
                </div>

                {subtotal >= 5000 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                    🎉 You're saving ₹200 on delivery!
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-base font-semibold">
                  <span>Total Amount</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                className="w-full mt-6 bg-foreground text-background hover:bg-foreground/90 py-6 text-base font-semibold rounded-md"
                style={{ fontFamily: "'Poppins', sans-serif" }}
                onClick={() => {
                  // Navigate to payment or process checkout
                  console.log('Proceeding to payment...');
                }}
              >
                PLACE ORDER
              </Button>

              {/* Trust Badges */}
              <div className="mt-4 pt-4 border-t border-border" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>100% Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>7-Day Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
