import { useState, useEffect } from "react";

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  // Function to get user role from sessionStorage
  const getUserRoleFromStorage = () => {
    if (typeof window === "undefined") {
      return null;
    }

    const storedData = sessionStorage.getItem("userAuthData");
    if (!storedData) {
      return null;
    }

    try {
      const userAuth = JSON.parse(storedData);
      return userAuth.role;
    } catch (error) {
      console.error("Error parsing userAuthData:", error);
      return null;
    }
  };

  // Update initial state
  useEffect(() => {
    setUserRole(getUserRoleFromStorage());
  }, []);

  // Listen for changes in sessionStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setUserRole(getUserRoleFromStorage());
    };

    // Create custom event to notify userAuth changes
    window.addEventListener("userAuthChange", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("userAuthChange", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return userRole;
}; 