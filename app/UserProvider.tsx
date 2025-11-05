'use client';

import { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../app/firebaseConfig';

export interface AppUser {
  uid: string;
  email: string | null;
  name?: string;
  avatar?: string;
  phone?: string;
  role?: 'user' | 'admin';
}

export interface UserContextType {
  user: AppUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = useCallback(async (firebaseUser: User) => {
    const userDocRef = doc(db, "customers", firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: userData.name,
        avatar: userData.avatar,
        phone: userData.phone,
        role: userData.role || "user", // Default to 'user' if role is not set
      });
    } else {
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        role: "user", // Default new users to 'user' role
      });
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // setLoading(true) is already set. Wait for details before setting to false.
        await fetchUserDetails(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false); // This now runs AFTER user details are fetched or user is set to null.
    });

    return () => unsubscribe();
  }, [fetchUserDetails]);

  const logout = async () => {
    await signOut(auth);
  };

  const refreshUserData = async () => {
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      setLoading(true);
      await fetchUserDetails(firebaseUser);
    }
  };

  const value = {
    user,
    loading,
    logout,
    refreshUserData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};