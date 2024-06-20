"use client";
import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import { useAuth } from "@providers/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DetailModal from "@components/modal";
import { useRouter } from "next/navigation";
import { useLoading } from "@providers/loading";
import { restApiBase } from "@libs/restApi";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// Define the User type based on your application's user structure
const Navbar = () => {
  const { activeItem, logout, user } = useAuth();
  const { setLoading }: any = useLoading();
  const router = useRouter();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const [errorMsg, setErrorMsg] = useState("");

  const handleCloseDetailModal = () => {
    setIsOpenModal(false);
  };
  const handleOpenDetailModal = () => {
    setIsOpenModal(true);
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleChangePassword = async (oldPass: string, newPass: string) => {
    try {
      const result = await restApiBase({oldPassword: oldPass, newPassword: newPass}, 'api/auth/change-password', 'PUT');  
    } catch (error) {
      console.error(error);
    }
    
  };
  const handleSubmit = async () => {
    setLoading(true);
    await handleChangePassword(oldPassword as string, newPassword as string);
    setIsOpenModal(false);
    logout();
    router.push("/login");
  };

  return (
    <>
      <Disclosure as="nav" className="bg-nashtech text-white">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between font-bold">
            <div>{activeItem.name}</div>
            <div className="relative">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="inline-flex justify-center w-full px-4 py-2 bg-nashtech text-sm font-medium text-white hover:bg-gray-700 focus:outline-none">
                    {user?.username}
                  </MenuButton>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95">
                  <MenuItems className="absolute right-0 mt-2 w-40 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="p-3 flex justify-center flex-col">
                      <div className="hover:bg-nashtech hover:text-white text-black text-sm rounded px-2 mb-2">
                        <a href="#" onClick={handleOpenDetailModal}>Change Password</a>
                      </div>
                      <div className="hover:bg-nashtech hover:text-white text-black text-sm rounded px-2">
                        <a href="#" onClick={logout}>
                          Logout
                        </a>
                      </div>
                    </div>
                  </MenuItems>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </Disclosure>
      <DetailModal
        isOpen={isOpenModal}
        onClose={handleCloseDetailModal}
        title="Change Password">
        <div>
          <form
            className="w-full p-5"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}>
            <div className="md:flex md:items-center mb-3 relative">
              <div className="md:w-1/3">
                <label className="block text-gray-700 mb-1 md:mb-0 pr-4">
                  Old Password
                </label>
              </div>
              <div className="md:w-2/3 relative">
                <input
                  className="border border-black rounded w-full py-1 px-4"
                  id="inline-password"
                  name="oldPassword"
                  type={showPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value), setErrorMsg("");
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
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value), setErrorMsg("");
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
                  !oldPassword && !newPassword
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-75"
                }`}
                disabled={!oldPassword && !newPassword}
                type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      </DetailModal>
    </>
  );
};

export default Navbar;
