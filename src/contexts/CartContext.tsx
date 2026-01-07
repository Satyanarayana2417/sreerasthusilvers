import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, setDoc, getDoc, onSnapshot, updateDoc, deleteField } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Cart Item Interface
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
  weight?: string;
  purity?: string;
}

// Cart Context Interface
interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  addToCart: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: number;
  subtotal: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Local storage key for guest users
const CART_STORAGE_KEY = 'sree_rasthu_cart';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔐 Auth state changed:', user?.uid || 'Guest');
      setCurrentUserId(user?.uid || null);
      
      // If user logs in, migrate guest cart to Firebase
      if (user?.uid) {
        migrateGuestCartToFirebase(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  // Migrate guest cart from localStorage to Firebase when user logs in
  const migrateGuestCartToFirebase = async (userId: string) => {
    try {
      const guestCart = localStorage.getItem(CART_STORAGE_KEY);
      if (guestCart) {
        const guestItems: CartItem[] = JSON.parse(guestCart);
        if (guestItems.length > 0) {
          console.log('📦 Migrating guest cart to Firebase:', guestItems.length, 'items');
          
          // Convert array to object for Firebase
          const cartData: Record<string, CartItem> = {};
          guestItems.forEach(item => {
            cartData[item.id] = item;
          });

          await setDoc(doc(db, 'carts', userId), {
            items: cartData,
            updatedAt: new Date().toISOString(),
          }, { merge: true });

          // Clear guest cart
          localStorage.removeItem(CART_STORAGE_KEY);
          console.log('✅ Guest cart migrated successfully');
        }
      }
    } catch (error) {
      console.error('❌ Error migrating guest cart:', error);
    }
  };

  // Load cart based on user authentication
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const loadCart = async () => {
      setLoading(true);
      
      if (currentUserId) {
        // Load from Firebase with real-time listener for logged-in users
        console.log('👤 Loading cart from Firebase for user:', currentUserId);
        
        const cartRef = doc(db, 'carts', currentUserId);
        
        unsubscribe = onSnapshot(
          cartRef,
          (snapshot) => {
            console.log('👂 Firebase listener triggered');
            console.log('📄 Snapshot exists?', snapshot.exists());
            
            if (snapshot.exists()) {
              const data = snapshot.data();
              console.log('📦 Raw Firebase data:', data);
              
              const cartItems: CartItem[] = data.items 
                ? Object.values(data.items) 
                : [];
              
              console.log('🔄 Firebase cart updated:', cartItems.length, 'items');
              console.log('🛍️ Cart items:', cartItems);
              setItems(cartItems);
            } else {
              console.log('📭 No existing cart - starting fresh');
              setItems([]);
            }
            setLoading(false);
          },
          (error: any) => {
            console.error('❌ Firebase listener error:', error);
            console.error('❌ Error code:', error?.code);
            console.error('❌ Error message:', error?.message);
            setLoading(false);
          }
        );
      } else {
        // Load from localStorage for guest users
        console.log('👻 Loading cart from localStorage (guest)');
        try {
          const savedCart = localStorage.getItem(CART_STORAGE_KEY);
          if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            console.log('📦 Loaded', parsedCart.length, 'items from localStorage');
            setItems(parsedCart);
          } else {
            setItems([]);
          }
        } catch (error) {
          console.error('❌ Error loading localStorage cart:', error);
          setItems([]);
        }
        setLoading(false);
      }
    };

    loadCart();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUserId]);

  // Save cart to localStorage for guest users
  useEffect(() => {
    if (!currentUserId && !loading) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        console.log('💾 Saved to localStorage:', items.length, 'items');
      } catch (error) {
        console.error('❌ Error saving to localStorage:', error);
      }
    }
  }, [items, currentUserId, loading]);

  // Add item to cart (Firebase + localStorage)
  const addToCart = async (item: Omit<CartItem, 'quantity'>) => {
    console.log('🛒 Adding to cart:', item.name);
    console.log('🔑 Current user ID:', currentUserId || 'GUEST');
    
    try {
      if (currentUserId) {
        // Add to Firebase for logged-in users
        console.log('📡 Attempting Firebase write...');
        const cartRef = doc(db, 'carts', currentUserId);
        
        console.log('📖 Reading existing cart...');
        const cartSnap = await getDoc(cartRef);
        
        let updatedItems: Record<string, CartItem> = {};
        
        if (cartSnap.exists()) {
          console.log('📦 Found existing cart');
          updatedItems = cartSnap.data().items || {};
        } else {
          console.log('🆕 Creating new cart');
        }

        // Check if item exists, increment quantity or add new
        if (updatedItems[item.id]) {
          updatedItems[item.id].quantity += 1;
          console.log('➕ Incremented quantity for:', item.name, 'to', updatedItems[item.id].quantity);
        } else {
          updatedItems[item.id] = { ...item, quantity: 1 };
          console.log('✨ Added new item:', item.name);
        }

        console.log('💾 Writing to Firebase...');
        await setDoc(cartRef, {
          items: updatedItems,
          updatedAt: new Date().toISOString(),
        }, { merge: true });

        console.log('✅ Firebase cart updated successfully');
        console.log('📊 Total items in cart:', Object.keys(updatedItems).length);
      } else {
        console.log('👻 Guest mode - using localStorage');
        // Add to local state for guest users
        setItems((prevItems) => {
          const existingItem = prevItems.find((i) => i.id === item.id);
          
          if (existingItem) {
            console.log('➕ Incremented quantity for:', item.name);
            return prevItems.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            );
          } else {
            console.log('✨ Added new item:', item.name);
            return [...prevItems, { ...item, quantity: 1 }];
          }
        });
      }
      
      // Open cart when item is added
      setIsCartOpen(true);
    } catch (error: any) {
      console.error('❌ ERROR adding to cart:', error);
      console.error('❌ Error code:', error?.code);
      console.error('❌ Error message:', error?.message);
      
      // More specific error messages
      if (error?.code === 'permission-denied') {
        alert('Permission denied. Please make sure you are logged in.');
      } else if (error?.code === 'unavailable') {
        alert('Network error. Please check your internet connection.');
      } else {
        alert('Failed to add item to cart. Please try again.');
      }
    }
  };

  // Remove item from cart
  const removeFromCart = async (id: string) => {
    console.log('🗑️ Removing from cart:', id);
    
    try {
      if (currentUserId) {
        // Remove from Firebase
        const cartRef = doc(db, 'carts', currentUserId);
        const cartSnap = await getDoc(cartRef);
        
        if (cartSnap.exists()) {
          const updatedItems = { ...cartSnap.data().items };
          delete updatedItems[id];

          await setDoc(cartRef, {
            items: updatedItems,
            updatedAt: new Date().toISOString(),
          }, { merge: true });

          console.log('✅ Item removed from Firebase');
        }
      } else {
        // Remove from local state
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('❌ Error removing from cart:', error);
    }
  };

  // Update item quantity
  const updateQuantity = async (id: string, quantity: number) => {
    console.log('🔢 Updating quantity for', id, 'to', quantity);
    
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    try {
      if (currentUserId) {
        // Update in Firebase
        const cartRef = doc(db, 'carts', currentUserId);
        const cartSnap = await getDoc(cartRef);
        
        if (cartSnap.exists()) {
          const updatedItems = { ...cartSnap.data().items };
          if (updatedItems[id]) {
            updatedItems[id].quantity = quantity;

            await setDoc(cartRef, {
              items: updatedItems,
              updatedAt: new Date().toISOString(),
            }, { merge: true });

            console.log('✅ Quantity updated in Firebase');
          }
        }
      } else {
        // Update local state
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, quantity } : item
          )
        );
      }
    } catch (error) {
      console.error('❌ Error updating quantity:', error);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    console.log('🧹 Clearing cart');
    
    try {
      if (currentUserId) {
        // Clear Firebase cart
        const cartRef = doc(db, 'carts', currentUserId);
        await setDoc(cartRef, {
          items: {},
          updatedAt: new Date().toISOString(),
        });
        console.log('✅ Firebase cart cleared');
      } else {
        // Clear local state
        setItems([]);
      }
    } catch (error) {
      console.error('❌ Error clearing cart:', error);
    }
  };

  // Cart drawer controls
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value: CartContextType = {
    items,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    totalItems,
    subtotal,
    loading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
