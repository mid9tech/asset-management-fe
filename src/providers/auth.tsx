"use client";
import { usePathname, useRouter } from "next/navigation";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { useLoading } from "./loading";
import LoginPage from '../app/login/page'

type menuItem = {
  name: string;
  path: string;
};

export const AuthContext = createContext<{
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
  activeItem: menuItem;
  setActiveItem: (item: menuItem) => void;
  menuItems: menuItem[];
  logout: () => void;
  // account: Account | null;
  // setAccount: Dispatch<SetStateAction<Account | null>>;
} | null>(null);

const menuItems = [
  { name: "Home", path: "/home" },
  { name: "Manage User", path: "/user" },
  { name: "Manage Asset", path: "/asset" },
  { name: "Manage Assignment", path: "/assignment" },
  { name: "Request For Return", path: "/request-returning" },
  { name: "Report", path: "/report" },
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [token, setToken] = useState("");

  const pathname = usePathname();
  const { setLoading }: any = useLoading();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token !== null) {
      setToken(token);
    } else {
      // refresh();
      console.log("unauthorized");
    }
    setLoading(false);
  }, []);

  const currentItem =
    menuItems.find((item) => item.path === pathname) ?? menuItems[0];
  const [activeItem, setActiveItem] = useState(currentItem);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setToken(""); // Clear the token state
    router.push("/login"); // Redirect to login page
  };
  const excludedPaths = ["/login"];

  if (excludedPaths.includes(pathname)) {
    return <><LoginPage/></>;
  }
  return (
    <AuthContext.Provider
      value={{
        menuItems,
        activeItem,
        setActiveItem,
        token,
        setToken,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
