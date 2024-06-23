/* eslint-disable react-hooks/exhaustive-deps */
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
import DetailModal from "@components/modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useLoading } from "./loading";
import LoginPage from "../app/login/page";
import ErrorPage from "../app/error/page";
import { ACCESS_TOKEN, USER } from "../constants";
import { USER_TYPE } from "../types/enum.type";
import { changePasswordFirstTimeLogin, logout } from "@services/auth";

type menuItem = {
  name: string;
  path: string;
};

export const AuthContext = createContext<{
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
  activeItem: menuItem | undefined;
  setActiveItem: (item: menuItem) => void;
  menuItems: menuItem[];
  user: User | null;
} | null>(null);

const menuForAdmin: menuItem[] = [
  { name: "Home", path: "/home" },
  { name: "Manage User", path: "/user" },
  { name: "Manage Asset", path: "/asset" },
  { name: "Manage Assignment", path: "/assignment" },
  { name: "Request For Return", path: "/request-returning" },
  { name: "Report", path: "/report" },
];

const menuForUsers: menuItem[] = [{ name: "Home", path: "/home" }];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [menu, setMenu] = useState<menuItem[]>([]);
  const pathname = usePathname();
  const { setLoading }: any = useLoading();

  useEffect(() => {
    const storedToken = sessionStorage.getItem(ACCESS_TOKEN);
    const storedUser = sessionStorage.getItem(USER);
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setLoading(false);
    } else {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    if (user) {
      if (user.role === USER_TYPE.ADMIN) {
        setMenu(menuForAdmin);
      } else if (user.role === USER_TYPE.STAFF) {
        setMenu(menuForUsers);
      } else {
        router.push("/error");
      }
      if (!user.isActived) {
        setIsOpenModal(true);
      }
    }
  }, [user]);

  useEffect(() => {
    const currentItem = menu.find((item) => item.path === pathname);
    setActiveItem(currentItem);
  }, [pathname, menu]);

  const [activeItem, setActiveItem] = useState<menuItem | undefined>(undefined);

  const handleSubmit = async () => {
    setLoading(true);
    Promise.all([changePasswordFirstTimeLogin(password), logout]).then(() => {
      setIsOpenModal(false);
      setLoading(false);
      router.push('/login');
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const excludedPaths = ["/login"];
  if (excludedPaths.includes(pathname)) {
    return (
      <AuthContext.Provider
        value={{
          menuItems: menu,
          activeItem,
          setActiveItem,
          token,
          setToken,
          user,
        }}>
        <LoginPage />
      </AuthContext.Provider>
    );
  }

  const errorPath = ["/error"];
  if (errorPath.includes(pathname)) {
    return (
      <AuthContext.Provider
        value={{
          menuItems: menu,
          activeItem,
          setActiveItem,
          token,
          setToken,
          user,
        }}>
        <ErrorPage />
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        menuItems: menu,
        activeItem,
        setActiveItem,
        token,
        setToken,
        user,
      }}>
      {children}
      <DetailModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(true)}
        title="Change Password">
        <div>
          <div className="italic">This is the first time you logged in.</div>
          <div className="italic">
            You have to change your password to continue.
          </div>
          <form
            className="w-full p-5"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}>
            <div className="md:flex md:items-center mb-3 relative">
              <div className="md:w-1/3">
                <label className="block text-gray-700 mb-1 md:mb-0 pr-4">
                  New Password
                </label>
              </div>
              <div className="md:w-2/3 relative">
                <input
                  className="border border-black rounded w-full py-1 px-4"
                  id="inline-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value), setErrorMsg("");
                  }}
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-0 top-0 mt-1 mr-2 text-gray-600 focus:outline-none">
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </button>
              </div>
            </div>
            <div className="h-5">
              <span className="text-nashtech text-xs italic">{errorMsg}</span>
            </div>

            <div className="flex flex-row-reverse mt-2">
              <button
                className={`bg-nashtech text-white py-1 px-3 rounded ${
                  !password
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-75"
                }`}
                disabled={!password}
                type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      </DetailModal>
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
