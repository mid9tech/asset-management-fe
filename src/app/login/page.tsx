"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Disclosure } from "@headlessui/react";
import Image from "next/image";

import { useLoading } from "@providers/loading";
import { useRouter } from "next/navigation";
import { login } from "@services/auth";
import { useAuth } from "@providers/auth";

export const dynamic = 'force-dynamic';

export default function Index() {
  const router = useRouter();
  const { setLoading }: any = useLoading();
  const {setUser, setToken}: any = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const result = await login(username, password);
      setLoading(false);
      if (!result) {
        setErrorMsg("Username or password is incorrect. Please try again");
        return;
      }
      console.log('result', result);
      const {accessToken, user} = result.data;
      setUser(user);
      setToken(accessToken);
      router.push("/home");
    } catch (error) {
      setErrorMsg("Username or password is incorrect. Please try again");
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
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
      <div className="w-full h-auto flex justify-center items-start mt-28">
        <div className="border rounded border-black w-auto">
          <div className="py-3 bg-cyangray rounded text-nashtech font-bold flex justify-center">
            <span>Welcome to Online Asset Management</span>
          </div>
          <hr className="border-b border-black" />
          <div>
            <form
              className="w-full p-5"
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}>
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label className="block text-gray-700 mb-1 md:mb-0 pr-4">
                    Username <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="md:w-2/3">
                  <input
                    className="border border-black rounded w-full py-1 px-4"
                    id="inline-full-name"
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value), setErrorMsg("");
                    }}
                  />
                </div>
              </div>
              <div className="md:flex md:items-center mb-3 relative">
                <div className="md:w-1/3">
                  <label className="block text-gray-700 mb-1 md:mb-0 pr-4">
                    Password <span className="text-red-500">*</span>
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
    </div>
  );
}
