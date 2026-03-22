import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // gọi /me khi reload
  useEffect(() => {
    axios.get("http://localhost:8080/api/auth/me", {
      withCredentials: true
    })
    .then(res => setUser(res.data))
    .catch(() => setUser(null));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}