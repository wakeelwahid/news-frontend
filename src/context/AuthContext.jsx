// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (mobile, password) => {
    try {
      const res = await fetch("https://newsnxus.onrender.com/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Invalid credentials");
      }

      const userData = await res.json();
      setUser(userData.user); // ✅ Only set user object, not full token response
      localStorage.setItem("user", JSON.stringify(userData.user));
      return userData;
    } catch (error) {
      throw new Error(error.message || "Login failed. Please try again.");
    }
  };

  const signup = async (name, mobile, password) => {
    try {
      const res = await fetch(
        "https://newsnxus.onrender.com/api/auth/register/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, mobile, password }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Signup failed");
      }

      const userData = await res.json();
      // Don't login user immediately; just return success
      return userData;
    } catch (error) {
      throw new Error(error.message || "Signup failed. Please try again.");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
