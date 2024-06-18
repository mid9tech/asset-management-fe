"use client";

import { Disclosure } from "@headlessui/react";
import { useAuth } from "@providers/auth";

const Navbar = () => {
  const { activeItem } = useAuth();
  return (
    <Disclosure as="nav" className="bg-nashtech text-white">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between font-bold">
          <div>{activeItem.name}</div>
          <div className="cursor-pointer">tinnt</div>
        </div>
      </div>
    </Disclosure>
  );
};

export default Navbar;
