'use client';

import React, { createContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOut as firebaseSignOut,
  getIdToken,
  onAuthChange,
} from '@/lib/firebase';
import { User, useSyncUserMutation } from '@/lib/graphql';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [syncUser] = useSyncUserMutation();

  // Handle SSR - mark component as mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync user with backend
  const syncUserWithBackend = async (firebaseUser: FirebaseUser) => {
    try {
      const idToken = await firebaseUser.getIdToken();

      // Extract name from displayName or email
      const displayName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
      const [firstName, ...lastNameParts] = displayName.split(' ');
      const lastName = lastNameParts.join(' ') || '';

      const result = await syncUser({
        variables: {
          input: {
            email: firebaseUser.email!,
            firstName,
            lastName,
            avatarUrl: firebaseUser.photoURL || undefined,
          },
        },
        context: {
          headers: {
            authorization: `Bearer ${idToken}`,
          },
        },
      });

      setUser(result.data?.syncUser || null);
    } catch (error) {
      console.error('Error syncing user with backend:', error);
    }
  };

  useEffect(() => {
    // Only run auth listener on client side
    if (typeof window === 'undefined') return;

    const unsubscribe = onAuthChange(async firebaseUser => {
      if (firebaseUser) {
        await syncUserWithBackend(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    const result = await signInWithEmail(email, password);
    if (result.user) {
      await syncUserWithBackend(result.user);
    }
  };

  const handleSignUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    const result = await signUpWithEmail(email, password);
    if (result.user) {
      await syncUser({
        variables: {
          input: {
            email,
            firstName,
            lastName,
          },
        },
        context: {
          headers: {
            authorization: `Bearer ${await result.user.getIdToken()}`,
          },
        },
      });
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();
    if (result.user) {
      await syncUserWithBackend(result.user);
    }
  };

  const handleSignOut = async () => {
    await firebaseSignOut();
    setUser(null);
  };

  const getToken = async () => {
    return await getIdToken();
  };

  const value: AuthContextType = {
    isAuthenticated: !loading && !!user,
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signInWithGoogle: handleGoogleSignIn,
    signOut: handleSignOut,
    getToken,
  };

  // Prevent hydration mismatch by showing consistent state during SSR
  if (!mounted) {
    return (
      <AuthContext.Provider
        value={{
          user: null,
          isAuthenticated: false,
          loading: true,
          signIn: async () => {},
          signUp: async () => {},
          signInWithGoogle: async () => {},
          signOut: async () => {},
          getToken: async () => null,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
