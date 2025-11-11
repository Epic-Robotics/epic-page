import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../api/services';
import type { User, AuthResponse } from '../types/api';
import type { LoginCredentials, RegisterData } from '../api/services/auth.service';
import { TokenStorage } from '../api/client';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = TokenStorage.get();

      if (token) {
        try {
          const userData = await authService.getProfile();
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user:', error);
          TokenStorage.remove();
        }
      }

      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await authService.login(credentials);
    setUser(response.user);
    return response;
  };

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await authService.register(data);
    setUser(response.user);
    return response;
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setUser(null);
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
      TokenStorage.remove();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
