import React, { createContext, useContext, useState, useEffect } from "react";
import { useStorageState } from "../hooks/useStorageState";
import { APICONSTANTS } from "@/constants/api";
import axios from "axios";
import { User } from "@/types/users";

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
  
  const { API_URL } = APICONSTANTS;

  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add interceptor to handle auth token
  api.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  const fetchCurrentUser = async (token: string) => {
    try {
      const response = await api.get('/users/currentUser');
      setUser(response.data);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchCurrentUser(accessToken).catch((error) => {
        console.error('Error fetching current user:', error);
        setError('Session expired. Please login again.');
      });
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [accessToken]);

  const signIn = (token: string) => {
    setError(null);
    setAccessToken(token);
  };

  const signOut = () => {
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const signUp = async (credentials: SignUpCredentials) => {
    try {
      setError(null);
      const response = await api.post('/auth/signup', credentials);
      const { token, user } = response.data;
      setUser(user);
      signIn(token);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Signup failed. Please try again.');
      throw error;
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      setUser(user);
      signIn(token);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Login failed. Please try again.');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
