"use client";
import Navbar from "@components/navbar";
import Sidebar from "@components/sidebar";
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
    return <>{children}</>;
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
      <Navbar />
      <div className="grid grid-cols-10 gap-4">
        <div className="col-start-2 col-span-8">
          <div className="grid sm:grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-10">
            <div>
              <Sidebar />
            </div>
            <div className="col-span-4 p-5">
              <div className="mt-20">{children}</div>
            </div>
          </div>
        </div>
      </div>
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
