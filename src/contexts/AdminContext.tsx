import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminContextType {
  isLoggedIn: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  adminCredentials: {
    username: string;
    password: string;
  };
  updateCredentials: (username: string, password: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    username: "admin",
    password: "artify2026",
  });

  // Load credentials from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("adminCredentials");
    if (saved) {
      try {
        setAdminCredentials(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load admin credentials", e);
      }
    }

    // Check if already logged in
    const loggedIn = localStorage.getItem("adminLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const login = (password: string): boolean => {
    if (
      (password === adminCredentials.password)
    ) {
      setIsLoggedIn(true);
      localStorage.setItem("adminLoggedIn", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("adminLoggedIn");
  };

  const updateCredentials = (username: string, password: string) => {
    const newCredentials = { username, password };
    setAdminCredentials(newCredentials);
    localStorage.setItem("adminCredentials", JSON.stringify(newCredentials));
  };

  return (
    <AdminContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        adminCredentials,
        updateCredentials,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
};
