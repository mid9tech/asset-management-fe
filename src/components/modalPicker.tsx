import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ModalPickerProps {
  isOpen: boolean;
  setOpenModal: (value: boolean) => void;
}

const ModalPicker: React.FC<ModalPickerProps> = ({ isOpen, setOpenModal }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setOpenModal]);

  if (!isOpen) return null;

  const handleSelectUser = (code: string) => {
    setSelectedUser(code);
  };

  const handleSave = () => {
    console.log("Selected user:", selectedUser);
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
              <Input
                type="text"
                className="mt-1 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="p-3">
            <div className="grid grid-cols-8 gap-4">
              <div className=""></div>
              <div className="col-span-2 border-b-2 border-black">
                <span className="font-bold">Staff Code</span>
              </div>
              <div className="col-span-4 border-b-2 border-black">
                <span className="font-bold">Full Name</span>
              </div>
              <div className="border-b-2 border-black">
                <span className="font-bold">Type</span>
              </div>
              <div></div>
            </div>
            <div className="grid grid-cols-8 gap-4 mt-3">
              <div>
                <input type="radio" />
              </div>
              <div className="col-span-2 border-b-2 border-gray">
                <span>SD001</span>
              </div>
              <div className="col-span-4 border-b-2 border-gray">
                <span>Nguyen Van Binh</span>
              </div>
              <div className="border-b-2 border-gray">
                <span>ADMIN</span>
              </div>
              <div></div>
            </div>
            <div className="grid grid-cols-8 gap-4 mt-3">
              <div>
                <input type="radio" />
              </div>
              <div className="col-span-2 border-b-2 border-gray">
                <span>SD001</span>
              </div>
              <div className="col-span-4 border-b-2 border-gray">
                <span>Nguyen Van Binh</span>
              </div>
              <div className="border-b-2 border-gray">
                <span>ADMIN</span>
              </div>
              <div></div>
            </div>
          </div>
          <div className="px-4 py-4 sm:px-6 flex justify-end gap-3">
            <Button className="bg-nashtech text-white" onClick={handleSave}>
              Save
            </Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPicker;
