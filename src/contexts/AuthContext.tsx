import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

// Types
export interface UserProfile {
  uid: string;
  email: string | null;
  username: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signup: (email: string, password: string, username: string) => Promise<void>;
  login: (email: string, password: string) => Promise<UserProfile>;
  loginWithGoogle: () => Promise<UserProfile>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        const profile = await fetchUserProfile(firebaseUser.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Signup function
  const signup = async (email: string, password: string, username: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { uid } = userCredential.user;

    // Update display name
    await updateProfile(userCredential.user, { displayName: username });

    // Create user document in Firestore
    const userProfileData: UserProfile = {
      uid,
      email,
      username,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', uid), {
      ...userProfileData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setUserProfile(userProfileData);
  };

  // Login function
  const login = async (email: string, password: string): Promise<UserProfile> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await fetchUserProfile(userCredential.user.uid);
    
    if (!profile) {
      throw new Error('User profile not found');
    }
    
    setUserProfile(profile);
    return profile;
  };

  // Google login function
  const loginWithGoogle = async (): Promise<UserProfile> => {
    try {
      const provider = new GoogleAuthProvider();
      // Add additional scopes if needed
      provider.addScope('profile');
      provider.addScope('email');
      
      // Set custom parameters to ensure the account selection prompt
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const userCredential = await signInWithPopup(auth, provider);
      const { uid, email, displayName, photoURL } = userCredential.user;

      // Check if user profile exists
      let profile = await fetchUserProfile(uid);

      if (!profile) {
        // Create new profile for first-time Google users
        const userProfileData: UserProfile = {
          uid,
          email,
          username: displayName || email?.split('@')[0] || 'User',
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          avatar: photoURL || undefined,
        };

        await setDoc(doc(db, 'users', uid), {
          ...userProfileData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        profile = userProfileData;
      }

      setUserProfile(profile);
      return profile;
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      throw error; // Re-throw to be handled by the UI
    }
  };

  // Logout function
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  // Reset password
  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');

    await setDoc(doc(db, 'users', user.uid), {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    const updatedProfile = await fetchUserProfile(user.uid);
    setUserProfile(updatedProfile);
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    isAdmin: userProfile?.role === 'admin',
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
