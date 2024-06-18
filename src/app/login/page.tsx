"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Disclosure } from "@headlessui/react";
import Image from "next/image";

export default function Index() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    console.log("Username:", username);
    console.log("Password:", password);
    if (password !== "123456") {
      setErrorMsg("Invalid username or password");
    } else {
      localStorage.setItem("accessToken", JSON.stringify("this is token"));
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Disclosure as="nav" className="bg-nashtech text-white">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center flext-start font-bold gap-5">
            <Image src="/Logo_lk.png" alt="Logo" width={50} height={50} />
            <div className="text-white font-bold">Online Asset Management</div>
          </div>
        </div>
      </Disclosure>
      <div className="w-full h-screen flex justify-center items-start mt-28">
        <div className="border rounded border-black">
          <div className="py-3 bg-cyangray rounded text-nashtech font-bold flex justify-center">
            <span>Welcome to Online Asset Management</span>
          </div>
          <hr className="border border-black" />
          <div>
            <form
              className="w-full p-5"
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}>
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label className="block text-gray-700 font-bold mb-1 md:mb-0 pr-4">
                    Username
                  </label>
                </div>
                <div className="md:w-2/3">
                  <input
                    className="border border-black rounded w-full py-1 px-4"
                    id="inline-full-name"
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div className="md:flex md:items-center mb-6 relative">
                <div className="md:w-1/3">
                  <label className="block text-gray-700 font-bold mb-1 md:mb-0 pr-4">
                    Password
                  </label>
                </div>
                <div className="md:w-2/3 relative">
                  <input
                    className="border border-black rounded w-full py-1 px-4"
                    id="inline-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-0 top-0 mt-1 mr-2 text-gray-600 focus:outline-none">
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                  </button>
                </div>
              </div>
              {errorMsg ?? <span className="text-nashtech">{errorMsg}</span>}

              <div className="flex flex-row-reverse">
                <button
                  className={`bg-nashtech text-white py-1 px-2 rounded ${
                    !username || !password
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:opacity-75"
                  }`}
                  disabled={!username || !password}
                  type="submit">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
