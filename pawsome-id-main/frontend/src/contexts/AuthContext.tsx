import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '@/types';
import { 
  initializeStorage, 
  getUsers, 
  saveUsers, 
  getCurrentUser, 
  setCurrentUser,
  setPendingOtp,
  getPendingOtp,
  clearPendingOtp,
  generateId
} from '@/lib/storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingVerification: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    role: UserRole;
  }) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (otp: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingVerification, setPendingVerification] = useState<string | null>(null);

  useEffect(() => {
    initializeStorage();
    const savedUser = getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = getUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!foundUser) {
      return { success: false, error: 'User not found. Please check your email.' };
    }

    if (foundUser.password !== password) {
      return { success: false, error: 'Invalid password. Please try again.' };
    }

    if (!foundUser.verified) {
      return { success: false, error: 'Account not verified. Please complete verification.' };
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    setCurrentUser(userWithoutPassword);
    return { success: true };
  }, []);

  const register = useCallback(async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    role: UserRole;
  }): Promise<{ success: boolean; error?: string }> => {
    const users = getUsers();
    
    if (users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, error: 'Email already registered.' };
    }

    const newUser = {
      id: generateId('user'),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      address: userData.address,
      role: userData.role,
      verified: false,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    // Generate mock OTP (in real app, send via email)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setPendingOtp(userData.email, otp);
    setPendingVerification(userData.email);
    
    console.log(`[MOCK OTP] Your verification code is: ${otp}`);
    
    return { success: true };
  }, []);

  const verifyOtp = useCallback(async (otp: string): Promise<{ success: boolean; error?: string }> => {
    const pending = getPendingOtp();
    
    if (!pending) {
      return { success: false, error: 'No pending verification.' };
    }

    if (Date.now() > pending.expires) {
      clearPendingOtp();
      return { success: false, error: 'OTP expired. Please register again.' };
    }

    if (pending.otp !== otp) {
      return { success: false, error: 'Invalid OTP. Please try again.' };
    }

    // Mark user as verified
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === pending.email.toLowerCase());
    
    if (userIndex === -1) {
      return { success: false, error: 'User not found.' };
    }

    users[userIndex].verified = true;
    saveUsers(users);
    clearPendingOtp();
    setPendingVerification(null);

    // Auto-login after verification
    const { password: _, ...userWithoutPassword } = users[userIndex];
    setUser(userWithoutPassword);
    setCurrentUser(userWithoutPassword);

    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      pendingVerification,
      login,
      register,
      verifyOtp,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
