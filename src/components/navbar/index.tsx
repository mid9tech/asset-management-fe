/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItems,
  Transition,
} from "@headlessui/react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Fragment, useEffect, useState } from "react";
import { useAuth } from "@providers/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DetailModal from "@components/modal";
import { useLoading } from "@providers/loading";
import { restApiBase } from "@libs/restApi";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { USER } from "../../constants";
import { Button } from "@components/ui/button";

// Define the User type based on your application's user structure
const Navbar = () => {
  const { activeItem, logout, user } = useAuth();
  const { setLoading }: any = useLoading();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [confirmLogout, setConformLogout] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const [errorMsg, setErrorMsg] = useState("");
  const [userCurrent, setUserCurrent] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER);
    if (storedUser) {
      setUserCurrent(JSON.parse(storedUser));
      setLoading(false);
    }
  }, []);

  const handleCloseDetailModal = () => {
    setIsOpenModal(false);
    setConformLogout(false);
  };
  const handleOpenDetailModal = () => {
    setIsOpenModal(true);
  };
  const handleOpenConfirm = () => {
    setConformLogout(true);
  };
  const toggleShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };
  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };
  const handleChangePassword = async (oldPass: string, newPass: string) => {
    try {
      const result = await restApiBase(
        { oldPassword: oldPass, newPassword: newPass },
        "api/auth/change-password",
        "PUT"
      );
      setLoading(false);
      return result;
    } catch (error) {
      console.error(error);
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    const result = await handleChangePassword(
      oldPassword as string,
      newPassword as string
    );
    if (!result) {
      setErrorMsg("Old password is incorrect!");
      return;
    }
    setIsOpenModal(false);
    logout();
  };

  return (
    <>
      <Disclosure as="nav" className="bg-nashtech text-white">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between font-bold">
            <div>{activeItem?.name}</div>
            <div className="relative">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="inline-flex justify-center w-full px-4 py-2 bg-nashtech text-sm font-medium text-white hover:bg-gray-700 focus:outline-none">
                    {userCurrent?.username} <ArrowDropDownIcon />
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
                      <div
                        className="hover:bg-nashtech hover:text-white text-black text-sm rounded px-2 cursor-pointer mb-2"
                        onClick={handleOpenDetailModal}>
                        Change Password
                      </div>
                      <div
                        className="hover:bg-nashtech hover:text-white text-black text-sm rounded cursor-pointer px-2"
                        onClick={handleOpenConfirm}>
                        Logout
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
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value), setErrorMsg("");
                  }}
                />
                <button
                  type="button"
                  onClick={toggleShowOldPassword}
                  className="absolute right-0 top-0 mt-1 mr-2 text-gray-600 focus:outline-none">
                  <FontAwesomeIcon
                    icon={showOldPassword ? faEye : faEyeSlash}
                  />
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
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value), setErrorMsg("");
                  }}
                />
                <button
                  type="button"
                  onClick={toggleShowNewPassword}
                  className="absolute right-0 top-0 mt-1 mr-2 text-gray-600 focus:outline-none">
                  <FontAwesomeIcon
                    icon={showNewPassword ? faEye : faEyeSlash}
                  />
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
      <DetailModal
        isOpen={confirmLogout}
        onClose={handleCloseDetailModal}
        title="Are you sure ?">
        <div>
          <div>Do you want to logout ?</div>
          <div className="flex flex-row justify-center gap-3 mt-10">
            <Button onClick={logout} className="bg-nashtech text-white">
              Logout
            </Button>
            <Button onClick={handleCloseDetailModal}>Cancel</Button>
          </div>
        </div>
      </DetailModal>
    </>
  );
};

export default Navbar;
