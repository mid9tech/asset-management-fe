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
import { USER_TYPE } from "../types/enum.type";
import { changePasswordFirstTimeLogin, logout } from "@services/auth";
import { UserStoreType } from "../types/user.type";
import { ASSET_PATH_DEFAULT, ASSIGNMENT_PATH_DEFAULT, REQUEST_RETURN_PATH_DEFAULT, USER, USER_PATH_DEFAULT } from "../constants";
import { menuItem } from "../types/menu.type";
import { findMenuItem } from "@utils/findMenuItem";

export const AuthContext = createContext<{
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
  setUser: Dispatch<SetStateAction<UserStoreType | null>>;
  activeItem: menuItem | undefined;
  setActiveItem: (item: menuItem) => void;
  menuItems: menuItem[] | undefined;
  user: UserStoreType | null;
} | null>(null);

const menuForAdmin: menuItem[] = [
  { name: "Home", path: ["/home"], component: "Home" },
  {
    name: "Manage User",
    path: [ USER_PATH_DEFAULT, "/user/create", "/user/:id"],
    component: "User",
  },
  { name: "Manage Asset", path: [`${ASSET_PATH_DEFAULT}`, "/asset/create", "/asset/:id"], component: "Asset" },
  { name: "Manage Assignment", path: [`${ASSIGNMENT_PATH_DEFAULT}`, "/assignment/create", "/assignment/:id"], component: "Assignment" },
  {
    name: "Request For Return",
    path: [REQUEST_RETURN_PATH_DEFAULT],
    component: "request-returning",
  },
  { name: "Report", path: ["/report"], component: "Report" },
];

const menuForUsers: menuItem[] = [
  { name: "Home", path: ["/home"], component: "Home" },
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { setLoading }: any = useLoading();

  const [token, setToken] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<UserStoreType | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [menu, setMenu] = useState<menuItem[]>();
  const [activeItem, setActiveItem] = useState<menuItem | undefined>(undefined);

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case USER_TYPE.ADMIN:
          setMenu(menuForAdmin);
          break;
        case USER_TYPE.STAFF:
          setMenu(menuForUsers);
          break;
        default:
          router.push("/error");
          break;
      }
      if (!user.isActived) {
        setIsOpenModal(true);
      }
    }
  }, [user, activeItem]);

  useEffect(() => {
    if(menu) {
      const currentItem = findMenuItem(menu, pathname);
      setActiveItem(currentItem);
    }
    const userStorage = localStorage.getItem(USER);
    setUser(JSON.parse(userStorage as string));
  }, [pathname, menu, activeItem]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await changePasswordFirstTimeLogin(password);
      await logout();
      setIsOpenModal(false);
      router.push("/login");
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const excludedPaths = ["/login"];
  const errorPaths = ["/error"];
  if (excludedPaths.includes(pathname) || errorPaths.includes(pathname)) {
    return (
      <AuthContext.Provider
        value={{
          menuItems: menu,
          activeItem,
          setActiveItem,
          token,
          setToken,
          setUser,
          user,
        }}>
        {excludedPaths.includes(pathname) ? <LoginPage /> : <ErrorPage />}
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
        setUser,
        user,
      }}>
      {children}
      <DetailModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(true)}
        isShowCloseIcon={false}
        title="Change Password">
        <div className="flex flex-col gap-10">
          <div>
            <div className="italic">This is the first time you logged in.</div>
            <div className="italic">
              You have to change your password to continue.
            </div>
          </div>

          <form
            className="w-full "
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}>
            <div className="flex justify-start items-center mb-3 relative">
              <div className="w-1/2">
                <label className="block text-gray-700 mb-1 md:mb-0">
                  New Password <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-2/3 relative">
                <input
                  className="border border-black rounded w-full py-1 px-1"
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
