"use client";
import React, { useState } from "react";
import { Disclosure } from "@headlessui/react";
import Image from "next/image";

import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Index() {
  const route = useRouter();
  const bancToHomeButton = () => {
    route.push("/home");
  };
  return (
    <div>
      <Disclosure as="nav" className="bg-nashtech text-white">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center flext-start font-bold gap-5">
            <Image src="/Logo_lk.png" alt="Logo" width={50} height={50} />
            <div className="text-white font-bold">Online Asset Management</div>
          </div>
        </div>
      </Disclosure>
      <div className="w-full h-screen flex justify-center items-start mt-28">
        <div className="text-nashtech font-bold italic flex justify-end flex-col gap-5">
          <h1>ACCESS DENIEND!</h1>
          <button className="bg-nashtech text-white" onClick={bancToHomeButton}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
