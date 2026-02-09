'use client';

import React, { createContext, useContext, ReactNode, useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { User } from 'firebase/auth';

// A mock user object.
const mockUser = {
  uid: 'admin-user',
  email: 'admin@lagomar.app',
  displayName: 'Administrador',
} as User;

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  isAuthLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const login = (password: string): boolean => {
    if (password === 'L') {
        setUser(mockUser);
        toast({
          title: '¡Sesión Iniciada!',
          description: 'Has iniciado sesión como administrador.',
        });
        return true;
    } else {
        toast({
            title: 'Error',
            description: 'Contraseña incorrecta.',
            variant: 'destructive',
        });
        return false;
    }
  };

  const logout = () => {
    setUser(null);
    toast({
      title: 'Sesión Cerrada',
      description: 'Has cerrado sesión con éxito.',
    });
  };

  const isAdmin = !!user;
  const isAuthenticated = !!user;
  const isAuthLoading = false; // No async loading needed for this mock auth.

  const value = useMemo(() => ({
    user,
    isAdmin,
    login,
    logout,
    isAuthLoading,
    isAuthenticated,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [user]);


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};