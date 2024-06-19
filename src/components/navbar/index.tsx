"use client";
import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useAuth } from "@providers/auth";
import { USER } from "../../constants";

const Navbar = () => {
  const { activeItem, logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = JSON.parse(localStorage.getItem(USER) as string);
      setUser(storedUser);
    }
  }, []);

  return (
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
                  <div className="p-3">
                    <MenuItems className="hover:bg-nashtech hover:text-white text-black text-sm rounded px-2 mb-2">
                      <a href="#">Change Password</a>
                    </MenuItems>
                    <MenuItems className="hover:bg-nashtech hover:text-white text-black text-sm rounded px-2">
                      <a href="#" onClick={logout}>
                        Logout
                      </a>
                    </MenuItems>
                  </div>
                </MenuItems>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </Disclosure>
  );
};

export default Navbar;
