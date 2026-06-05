import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("/users/me");

      if (response.data.success) {
        setUser(response.data.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching current user profile:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const savedRole = localStorage.getItem("role");
      if (token) {
        setIsAuthenticated(true);
        setRole(savedRole);
        await fetchCurrentUser();
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (token, userRole, userData = null) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", userRole);
    setIsAuthenticated(true);
    setRole(userRole);
    if (userData) {
      setUser(userData); // ✅ /me chaqirmasdan to'g'ridan-to'g'ri set qiling
    } else {
      await fetchCurrentUser();
    }
   };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        role,
        login,
        logout,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
