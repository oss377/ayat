// contexts/UserContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../app/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

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

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = useCallback(async (firebaseUser: User) => {
    try {
      const userDoc = await getDoc(doc(db, 'customers', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: userData.name,
          avatar: userData.avatar,
          phone: userData.phone,
          role: userData.role || 'user',
        });
      } else {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: 'user',
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        role: 'user',
      });
    }
  }, []);

  const refreshUserData = async () => {
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      setLoading(true);
      await fetchUserDetails(firebaseUser);
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchUserDetails(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserDetails]);

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    loading,
    logout,
    refreshUserData,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// This is a named export
export function useUser() {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error(
      'useUser must be used within a UserProvider. ' +
      'Make sure you have wrapped your app with <UserProvider> in your layout.tsx file.'
    );
  }
  
  return context;
}