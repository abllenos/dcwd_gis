import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTokenExpiration } from "./components/util/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  let logoutTimer: NodeJS.Timeout;

  const login = () => {
    setIsAuthenticated(true);

    const token = localStorage.getItem("token");
    if (token) {
      const exp = getTokenExpiration(token);
      if (exp) {
        const timeout = exp - Date.now();
        logoutTimer = setTimeout(() => {
          logout();
        }, timeout);
      }
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const exp = getTokenExpiration(token);
      if (exp && Date.now() < exp) {
        setIsAuthenticated(true);
        const timeout = exp - Date.now();
        logoutTimer = setTimeout(() => {
          logout();
        }, timeout);
      } else {
        logout();
      }
    }
    return () => clearTimeout(logoutTimer);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
