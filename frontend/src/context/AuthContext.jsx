import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Không parse được user từ localStorage:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      setUser(null);
    }
  }, []);

  const role = useMemo(() => {
    if (!user) return null;

    if (typeof user.role === "string" && user.role.trim()) {
      return user.role.trim().toUpperCase();
    }

    if (Array.isArray(user.roles) && user.roles.length > 0) {
      return String(user.roles[0]).replace("ROLE_", "").toUpperCase();
    }

    if (Array.isArray(user.authorities) && user.authorities.length > 0) {
      return String(user.authorities[0]).replace("ROLE_", "").toUpperCase();
    }

    const savedRole = localStorage.getItem("role");
    if (savedRole) {
      return savedRole.toUpperCase();
    }

    return null;
  }, [user]);

  const isAuthenticated = !!localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setUser(null);
    window.location.href = "/login";
  };

  const value = {
    user,
    setUser,
    role,
    isAuthenticated,
    isDoctor: role === "DOCTOR",
    isPatient: role === "PATIENT",
    isAdmin: role === "ADMIN",
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
