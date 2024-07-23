import type { Metadata } from "next";

import Navbar from "@components/navbar";
import Sidebar from "@components/sidebar";
import { ToastContainer } from "react-toastify";

import { Fragment } from "react";

export const metadata: Metadata = {
  title: "AssetMaster",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Fragment>
      <Navbar />
      <div className="flex flex-grow justify-evenly items-start gap-3 px-3">
        <div className="w-1/6">
          <Sidebar />
        </div>
        <div className="w-5/6">
          <div className="mt-10">{children}</div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

    </Fragment>
  );
}
