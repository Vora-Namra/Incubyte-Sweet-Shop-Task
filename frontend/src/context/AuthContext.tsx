/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, type ReactNode, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  id: string;
  isAdmin: boolean;
};

type AuthContextType = {
  token: string | null;
  isAdmin: boolean;
  setToken: (token: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const setToken = (token: string | null) => {
    setTokenState(token);
    if (token) {
      localStorage.setItem("token", token);
      try {
        const decoded: TokenPayload = jwtDecode(token);
        setIsAdmin(decoded.isAdmin);
      } catch {
        setIsAdmin(false);
      }
    } else {
      localStorage.removeItem("token");
      setIsAdmin(false);
    }
  };

  const logout = () => setToken(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded: TokenPayload = jwtDecode(token);
        setIsAdmin(decoded.isAdmin);
      } catch {
        setIsAdmin(false);
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, isAdmin, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
