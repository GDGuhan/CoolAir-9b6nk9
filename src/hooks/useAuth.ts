import { useState, useCallback } from "react";
import { User } from "@/types";
import { toast } from "sonner";

const AUTH_STORAGE_KEY = "coolair_user";

// Mock user database
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: "u001",
    name: "Arun Sharma",
    email: "arun@example.com",
    password: "password123",
    phone: "+91 98765 43210",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arun",
    addresses: [
      {
        id: "a001",
        label: "Home",
        street: "12, MG Road",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560001",
        isDefault: true,
      },
    ],
    createdAt: "2024-01-15",
  },
];

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const found = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (found) {
      const { password: _pass, ...userWithoutPassword } = found;
      setUser(userWithoutPassword);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword));
      toast.success(`Welcome back, ${found.name}!`);
      setIsLoading(false);
      return true;
    }

    toast.error("Invalid email or password");
    setIsLoading(false);
    return false;
  }, []);

  const register = useCallback(async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const exists = MOCK_USERS.find((u) => u.email === email);
    if (exists) {
      toast.error("Email already registered");
      setIsLoading(false);
      return false;
    }

    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      addresses: [],
      createdAt: new Date().toISOString().split("T")[0],
    };

    // Add to mock DB
    MOCK_USERS.push({ ...newUser, password });
    setUser(newUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    toast.success(`Welcome to CoolAir, ${name}!`);
    setIsLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    toast.success("Signed out successfully");
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };
}
