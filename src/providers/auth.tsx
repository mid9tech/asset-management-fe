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
import LoginPage from "../app/login/page";
import { ACCESS_TOKEN, USER } from "../constants";
import { restApiBase } from "@libs/restApi";

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
  handleLoginApi: (username: string, password: string) => void;
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
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token !== null) {
      setToken(token);
    } else {
      // refresh();
      router.push("/login");
    }
    setLoading(false);
  }, []);

  const currentItem =
    menuItems.find((item) => item.path === pathname) ?? menuItems[0];
  const [activeItem, setActiveItem] = useState(currentItem);

  const logout = async () => {
    setLoading(true);
    await handleLogoutApi();
    setToken(""); // Clear the token state
    router.push("/login"); // Redirect to login page
  };
  const handleLoginApi = async (username: string, password: string) => {
    try {
      const result = await restApiBase(
        { username, password },
        "api/auth/login"
      );
      localStorage.setItem(ACCESS_TOKEN, result.data.accessToken);
      localStorage.setItem(USER, JSON.stringify(result.data.user));
      setLoading(false);
      router.push("/home");
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  const handleLogoutApi = async () => {
    try {
      await restApiBase({}, "api/auth/logout");
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(USER);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const excludedPaths = ["/login"];

  if (excludedPaths.includes(pathname)) {
    return (
      <AuthContext.Provider
        value={{
          menuItems,
          activeItem,
          setActiveItem,
          token,
          setToken,
          logout,
          handleLoginApi,
        }}>
        <LoginPage />
      </AuthContext.Provider>
    );
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
        handleLoginApi,
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
