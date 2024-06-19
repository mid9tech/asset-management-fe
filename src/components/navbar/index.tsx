"use client";

import { Disclosure } from "@headlessui/react";
import { useAuth } from "@providers/auth";
import { USER } from "../../constants";

const Navbar = () => {
  const { activeItem, logout } = useAuth();
  // const user =JSON.parse(localStorage.getItem(USER) as string);
  return (
    <Disclosure as="nav" className="bg-nashtech text-white">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between font-bold">
          <div>Asset Management</div>
          <div className="cursor-pointer" onClick={logout}>tinnt</div>
        </div>
      </div>
    </Disclosure>
  );
};

export default Navbar;
