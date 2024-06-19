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
import { ACCESS_TOKEN, IS_ACTIVE_USER, USERNAME } from "../constants";
import { restApiBase } from "@libs/restApi";
import DetailModal from "@components/modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

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
  user: User | null;
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
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleCloseDetailModal = () => {
    // setIsOpenModal(false);
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const pathname = usePathname();
  const { setLoading }: any = useLoading();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    console.log("user", user);
    if (user && token) {
      setToken(token);
      if (!user.isActived) {
        setIsOpenModal(true);
      }
    } else {
      router.push("/login");
    }

    setLoading(false);
  }, [user]);

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
      if (result) {
        localStorage.setItem(ACCESS_TOKEN, result?.data.accessToken);
        setUser(result?.data);
      }
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
  };

  const handleSubmit = () => {
    handleChangePasswordFirstLoginApi(password);
  };

  const handleChangePasswordFirstLoginApi = async (password: string) => {
    try {
      const response = await restApiBase(
        { newPassword: password },
        "api/auth/change-password"
      );
      console.log("password changed: ", response);
      setUser(response?.data);
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
      localStorage.removeItem(IS_ACTIVE_USER);
      localStorage.removeItem(USERNAME);
      setUser(null);
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
          user,
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
        user,
      }}>
      {children}
      <DetailModal
        isOpen={isOpenModal}
        onClose={handleCloseDetailModal}
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
