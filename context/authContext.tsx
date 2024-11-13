import React, { createContext, useContext, useState, useEffect } from "react";
import { useStorageState } from "../hooks/useStorageState";
import { api } from '@/lib/api';
import { User } from "@/types/users";
import axios from "axios";

interface AuthContextType {
  signIn: (token: string) => void;
  signOut: () => void;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  error: string | null;
}

interface SignUpCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  picture?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType>({
  signIn: () => null,
  signOut: () => null,
  signUp: async () => {},
  login: async () => {},
  accessToken: null,
  isLoading: false,
  isAuthenticated: false,
  user: null,
  setUser: () => null,
  error: null,
});

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [[isLoading, accessToken], setAccessToken] = useStorageState("accessToken");
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const fetchCurrentUser = async () => {
    try {
      // const response = await api.get('/users/currentUser');
      const response = await axios.get('http://192.168.1.65:8080/api/users/currentUser', {
        headers: {
          Authorization: "Bearer " + accessToken
        }
      })

      console.log("response users", response.data.user);
      
      if (response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return response.data.user;
      } else {
        throw new Error('User data not found in response');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        // signOut();
      } else {
        setError('Failed to fetch user data. Please try again.');
      }
      throw error;
    }
  };

  useEffect(() => {
    let isMounted = true;
    console.log(isLoading)

    if (isLoading) return;

    console.log(accessToken)
    if (accessToken) {
      console.log('Token found, fetching user data...');
      fetchCurrentUser().catch((error) => {
        if (isMounted) {
          console.log('Error in useEffect:', error);
        }
      });
    } else {
      console.log('No token found, clearing user state');
      setUser(null);
      setIsAuthenticated(false);
    }

    return () => {
      isMounted = false;
    };
  }, [accessToken, isLoading]);

  const signIn = (token: string) => {
    console.log('Signing in with token');
    setError(null);
    setAccessToken(token);
  };

  const signOut = () => {
    console.log('Signing out');
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const signUp = async (credentials: SignUpCredentials) => {
    try {
      console.log('Attempting signup...');
      setError(null);
      const response = await api.post('/auth/signup', credentials);
      
      const { token, user } = response.data;
      if (!token || !user) {
        throw new Error('Invalid response format');
      }
      
      setUser(user);
      signIn(token);
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.error || 
        error.message || 
        'Signup failed. Please try again.';
      setError(errorMessage);
      throw error;
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('Attempting login for:', credentials.email);
      setError(null);
      const response = await api.post('/auth/login', credentials);
      
      const { token, user } = response.data;
      if (!token || !user) {
        throw new Error('Invalid response format');
      }

      setUser(user);
      signIn(token);
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.error || 
        error.message || 
        'Login failed. Please try again.';
      setError(errorMessage);
      throw error;
    }
  };

  const contextValue = {
    signIn,
    signOut,
    signUp,
    login,
    accessToken,
    isLoading,
    isAuthenticated,
    user,
    setUser,
    error,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export type { AuthContextType, SignUpCredentials, LoginCredentials };
