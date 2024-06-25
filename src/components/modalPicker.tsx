import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ModalPickerProps {
  isOpen: boolean;
  setOpenModal: (value: boolean) => void;
}

const users = [
  { code: "SD1901", name: "An Nguyen Thuy", type: "Staff" },
  { code: "SD1234", name: "An Tran Van", type: "Staff" },
  { code: "SD0971", name: "Binh Nguyen Van", type: "Admin" },
  // ... more users
];

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

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="flex flex-row justify-center items-center">
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
            {/* <table className="min-w-full divide-y divide-gray-200 mt-4">
              <thead className="bg-gray-50 it">
                <tr>
                  <th className="px-4 py-2"></th>
                  <th className="px-4 py-2">Staff Code</th>
                  <th className="px-4 py-2 w-60">Full Name</th>
                  <th className="px-4 py-2">Type</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.code} className="hover:bg-gray-100">
                    <td className="px-4 py-2">
                      <input
                        type="radio"
                        name="selectedUser"
                        value={user.code}
                        checked={selectedUser === user.code}
                        onChange={() => handleSelectUser(user.code)}
                        className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                      />
                    </td>
                    <td className="px-4 py-2">{user.code}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.type}</td>
                  </tr>
                ))}
              </tbody>
            </table> */}
            <div className="grid grid-cols-6 gap-4">
              <div></div>
              <div>Staff Code</div>
              <div className="col-span-3">Full Name</div>
              <div>Type</div>
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
