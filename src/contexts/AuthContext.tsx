
import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status on mount
    checkAuth();
  }, []);

  const checkAuth = () => {
    const isAuth = api.isAuthenticated();
    setIsAuthenticated(isAuth);
    
    if (isAuth) {
      const user = api.getCurrentUser();
      setUsername(user?.username || null);
    } else {
      setUsername(null);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const result = await api.login(username, password);
      
      if (result.success) {
        checkAuth();
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate('/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: result.message || "Invalid username or password",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const result = await api.register(username, password);
      
      if (result.success) {
        checkAuth();
        toast({
          title: "Registration successful",
          description: "Your account has been created!",
        });
        navigate('/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: result.message || "Username already exists",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  const logout = () => {
    api.logout();
    checkAuth();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, register, logout }}>
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
