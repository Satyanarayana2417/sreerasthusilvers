import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '@/config/firebase';

export interface Banner {
  id?: string;
  imageUrl: string;
  redirectLink: string;
  order: number;
  status: 'active' | 'inactive';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const BANNERS_COLLECTION = 'banners';
const STORAGE_PATH = 'homepage-banners';

// Compress and resize image before upload
const compressImage = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Image compression failed'));
            }
          },
          'image/jpeg',
          0.85
        );
      };
      img.onerror = () => reject(new Error('Image load failed'));
    };
    reader.onerror = () => reject(new Error('File read failed'));
  });
};

// Upload banner image to Firebase Storage
export const uploadBannerImage = async (file: File): Promise<string> => {
  try {
    // Validate file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Image size must be less than 10MB');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    // Compress image
    const compressedBlob = await compressImage(file);
    
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storageRef = ref(storage, `${STORAGE_PATH}/${filename}`);

    // Upload to Firebase Storage
    await uploadBytes(storageRef, compressedBlob);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading banner image:', error);
    throw error;
  }
};

// Create new banner
export const createBanner = async (bannerData: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, BANNERS_COLLECTION), {
      ...bannerData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating banner:', error);
    throw error;
  }
};

// Update existing banner
export const updateBanner = async (id: string, bannerData: Partial<Banner>): Promise<void> => {
  try {
    const bannerRef = doc(db, BANNERS_COLLECTION, id);
    await updateDoc(bannerRef, {
      ...bannerData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating banner:', error);
    throw error;
  }
};

// Delete banner
export const deleteBanner = async (id: string, imageUrl: string): Promise<void> => {
  try {
    // Delete from Firestore
    const bannerRef = doc(db, BANNERS_COLLECTION, id);
    await deleteDoc(bannerRef);

    // Delete image from Storage
    if (imageUrl) {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef).catch(() => {
        // Image might already be deleted or doesn't exist
        console.log('Image not found in storage');
      });
    }
  } catch (error) {
    console.error('Error deleting banner:', error);
    throw error;
  }
};

// Get all banners (for admin)
export const getAllBanners = async (): Promise<Banner[]> => {
  try {
    const bannersQuery = query(
      collection(db, BANNERS_COLLECTION),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(bannersQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Banner));
  } catch (error) {
    console.error('Error fetching banners:', error);
    throw error;
  }
};

// Get active banners (for homepage)
export const getActiveBanners = async (): Promise<Banner[]> => {
  try {
    const bannersQuery = query(
      collection(db, BANNERS_COLLECTION),
      where('status', '==', 'active'),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(bannersQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Banner));
  } catch (error) {
    console.error('Error fetching active banners:', error);
    throw error;
  }
};

// Real-time listener for active banners
export const subscribeToActiveBanners = (
  callback: (banners: Banner[]) => void,
  onError?: (error: Error) => void
) => {
  const bannersQuery = query(
    collection(db, BANNERS_COLLECTION),
    where('status', '==', 'active'),
    orderBy('order', 'asc')
  );

  return onSnapshot(
    bannersQuery,
    (snapshot) => {
      const banners = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Banner));
      callback(banners);
    },
    (error) => {
      console.error('Error in banner subscription:', error);
      onError?.(error);
    }
  );
};
