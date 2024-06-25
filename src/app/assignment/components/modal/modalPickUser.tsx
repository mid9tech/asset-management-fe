/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useDebouncedCallback } from "use-debounce";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { loadData } from "@services/user";
import SearchIcon from "@public/icon/search.svg";
import { useLoading } from "@providers/loading";

import { USER_TYPE } from "../../../../types/enum.type";
import { FindUsersInput, User } from "../../../../__generated__/graphql";

interface ModalPickerProps {
  isOpen: boolean;
  setOpenModal: (value: boolean) => void;
}

const ModalUserPicker: React.FC<ModalPickerProps> = ({
  isOpen,
  setOpenModal,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { setLoading }: any = useLoading();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [listUser, setListUser] = useState<User[]>();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = useDebouncedCallback((term: string) => {
    setSearchTerm(term);
  }, 300);

  const loadUserList = async (filter: FindUsersInput) => {
    setLoading(true);
    const { data }: any = await loadData(filter);
    const listUserCustom = data?.users.map(
      (item: { type: USER_TYPE; lastName: any; firstName: any }) => ({
        ...item,
        fullName: `${item.lastName} ${item.firstName}`,
        type: item.type === USER_TYPE.STAFF ? "STAFF" : item.type,
      })
    );
    setListUser(listUserCustom);
    setLoading(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setOpenModal(false);
      }
    };
    if (isOpen) {
      loadUserList({
        page: 1,
        query: searchTerm,
        limit: 10,
      });

      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, searchTerm]);

  if (!isOpen) return null;

  const handleSelected = (userId: string) => {
    setSelectedUser(userId);
  };

  const handleSave = () => {
    console.log("Selected user:", selectedUser);
    setOpenModal(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white border border-black shadow-lg w-auto h-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-5">
          <div className="flex flex-row justify-between items-center">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Select User
              </h3>
            </div>
            <div className="px-4 sm:px-6">
              <div className="relative w-52 h-full">
                <input
                  onChange={(e) => {
                    handleSearch(e.target.value);
                  }}
                  className="w-full pr-9 rounded border-solid border outline-none px-2 py-1 border-graycustom"
                />
                <button className="absolute top-0 p-2 h-full right-0 border-l-graycustom border-l">
                  <Image
                    src={SearchIcon}
                    width={15}
                    height={15}
                    alt={"search icon"}
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-6 gap-4">
              <div></div>
              <div className="col border-b-2 border-black">
                <span className="font-bold">Staff Code</span>
              </div>
              <div className="col-span-3 border-b-2 border-black">
                <span className="font-bold">Full Name</span>
              </div>
              <div className="border-b-2 border-black">
                <span className="font-bold">Type</span>
              </div>
              <div></div>
            </div>
            {listUser?.map((item, key) => (
              <div
                key={key}
                className="grid grid-cols-6 gap-4 cursor-pointer"
                onClick={() => handleSelected(item.staffCode)}>
                <div className="flex justify-end items-center">
                  <label className="custom-radio">
                    <input
                      type="radio"
                      checked={selectedUser === item.staffCode}
                      onChange={() => handleSelected(item.staffCode)}
                    />
                    <span className="checkmark"></span>
                  </label>
                </div>
                <div className="col border-b-2 border-graycustom">
                  <span>{item.staffCode}</span>
                </div>
                <div className="col-span-3 border-b-2 border-graycustom">
                  <span>
                    {item.lastName} {item.firstName}
                  </span>
                </div>
                <div className="border-b-2 border-graycustom">
                  <span>{item.type}</span>
                </div>
                <div></div>
              </div>
            ))}
          </div>
          <div className="px-4 py-4 sm:px-6 flex justify-end gap-3">
            <Button className="bg-nashtech text-white" onClick={handleSave}>
              Save
            </Button>
            <Button variant="outline" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalUserPicker;
