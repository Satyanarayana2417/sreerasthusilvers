import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
  deleteDoc,
  Timestamp,
  onSnapshot,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface ShippingAddress {
  fullName: string;
  mobile: string;
  pincode: string;
  address: string;
  locality?: string;
  city: string;
  state: string;
  landmark?: string;
  alternativePhone?: string;
  addressType: 'home' | 'work';
}

export interface Order {
  id: string;
  orderId: string; // Unique order number for display
  userId: string;
  userEmail: string;
  userName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  taxAmount: number;
  discount: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type OrderFormData = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;

const ORDERS_COLLECTION = 'orders';

/**
 * Create a new order
 */
export const createOrder = async (orderData: OrderFormData): Promise<string> => {
  try {
    const now = Timestamp.now();
    const orderWithTimestamps = {
      ...orderData,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderWithTimestamps);
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
};

/**
 * Get a single order by ID
 */
export const getOrder = async (orderId: string): Promise<Order | null> => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Order;
    }
    return null;
  } catch (error) {
    console.error('Error getting order:', error);
    throw new Error('Failed to get order');
  }
};

/**
 * Get all orders for a specific user
 */
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw new Error('Failed to get user orders');
  }
};

/**
 * Get all orders (admin only)
 */
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
  } catch (error) {
    console.error('Error getting all orders:', error);
    throw new Error('Failed to get orders');
  }
};

/**
 * Subscribe to all orders in real-time (admin only)
 */
export const subscribeToAllOrders = (
  callback: (orders: Order[]) => void,
  onError?: (error: Error) => void
): (() => void) => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
        callback(orders);
      },
      (error) => {
        console.error('Error subscribing to orders:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Error setting up orders subscription:', error);
    throw new Error('Failed to subscribe to orders');
  }
};

/**
 * Subscribe to user's orders in real-time
 */
export const subscribeToUserOrders = (
  userId: string,
  callback: (orders: Order[]) => void,
  onError?: (error: Error) => void
): (() => void) => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
        callback(orders);
      },
      (error) => {
        console.error('Error subscribing to user orders:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Error setting up user orders subscription:', error);
    throw new Error('Failed to subscribe to user orders');
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (
  orderId: string,
  status: Order['status']
): Promise<void> => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error('Failed to update order status');
  }
};

/**
 * Update entire order
 */
export const updateOrder = async (
  orderId: string,
  updates: Partial<OrderFormData>
): Promise<void> => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating order:', error);
    throw new Error('Failed to update order');
  }
};

/**
 * Delete an order (admin only)
 */
export const deleteOrder = async (orderId: string): Promise<void> => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting order:', error);
    throw new Error('Failed to delete order');
  }
};

/**
 * Generate a unique order number
 */
export const generateOrderNumber = (): string => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

/**
 * Get order statistics (admin only)
 */
export const getOrderStats = async () => {
  try {
    const orders = await getAllOrders();
    
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, order) => sum + order.total, 0),
    };

    return stats;
  } catch (error) {
    console.error('Error getting order stats:', error);
    throw new Error('Failed to get order statistics');
  }
};
