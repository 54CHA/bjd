import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: {
    nickname: string;
    score: number;
  } | null;
  login: (nickname: string, score: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "earthquake_game_auth";

// Function to get initial state from localStorage
const getInitialState = () => {
  try {
    const storedAuth = localStorage.getItem(STORAGE_KEY);
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      return {
        isAuthenticated: true,
        user: authData.user,
      };
    }
  } catch (error) {
    console.error("Failed to parse stored auth data:", error);
    localStorage.removeItem(STORAGE_KEY);
  }
  return {
    isAuthenticated: false,
    user: null,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize state from localStorage
  const initialState = getInitialState();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    initialState.isAuthenticated
  );
  const [user, setUser] = useState<{ nickname: string; score: number } | null>(
    initialState.user
  );

  const login = (nickname: string, score: number) => {
    const userData = { nickname, score };
    setUser(userData);
    setIsAuthenticated(true);
    // Store both authentication state and user data
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user: userData,
        isAuthenticated: true,
      })
    );
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
