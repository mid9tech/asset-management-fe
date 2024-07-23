"use client";

import { useAuth } from "@providers/auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const { activeItem, setActiveItem, menuItems } = useAuth();
  const pathname = usePathname();

  const matchPath = (pattern: string, path: string) => {
    const queryStringIndex = path.indexOf('?');
    path = queryStringIndex !== -1 ? path.substring(0, queryStringIndex) : path;

    // Split the URL path by '/'
    const parts = path.split('/');

    // Return the first part after the initial empty string
    return parts[1] === pattern;
  };

  return (
    <div id="navbar" className="h-370 w-60 left-10 top-96 flex flex-col gap-1">
      <div className="flex flex-col justify-items-start py-6">
        <Image src="/mid9tech.png" alt="Logo" width={180} height={180} />
        <div className="text-gradient font-bold">Online Asset Management</div>
      </div>
      {menuItems?.map((item) => (
        <Link
          href={item.path[0]}
          key={item.name}
          onClick={() => {
            setActiveItem(item)
            console.log(item)
          }}
          className={`p-3 cursor-pointer font-bold ${matchPath(item.component.toLocaleLowerCase(), pathname)
            ? "bg-bluegray bg-custom-gradient text-white"
            : "bg-bluegray hover:bg-custom-gradient hover:text-white"
            }`}>
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
