import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

// The backend API base URL
const API_URL = 'http://localhost:8080/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'attendee' | 'organizer') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user and token in localStorage on initial load
    try {
      const savedUser = localStorage.getItem('eventPlatformUser');
      const savedToken = localStorage.getItem('eventPlatformToken');
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Handle failed login (e.g., 401 Unauthorized)
        console.error("Login failed:", await response.text());
        setIsLoading(false);
        return false;
      }

      const data = await response.json();
      
      // Set state and save to localStorage
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('eventPlatformUser', JSON.stringify(data.user));
      localStorage.setItem('eventPlatformToken', data.token);

      setIsLoading(false);
      return true;

    } catch (error) {
      console.error("An error occurred during login:", error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role: 'attendee' | 'organizer'): Promise<boolean> => {
    setIsLoading(true);
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, role }),
        });

        if (!response.ok) {
            console.error("Registration failed:", await response.text());
            setIsLoading(false);
            return false;
        }

        // After successful registration, automatically log the user in
        return await login(email, password);

    } catch (error) {
        console.error("An error occurred during registration:", error);
        setIsLoading(false);
        return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('eventPlatformUser');
    localStorage.removeItem('eventPlatformToken');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
