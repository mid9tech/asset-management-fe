"use client";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Column<T> = {
  header: string;
  accessor: keyof T;
};

interface ModalPickerProps<T> {
  isOpen: boolean;
  setOpenModal: (value: boolean) => void;
  columns: Column<T>[];
  data: T[];
  title: string;
}

const ModalPicker = <T extends {}>({
  columns,
  data,
  setOpenModal,
  isOpen,
  title
}: ModalPickerProps<T>) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<T>();
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

  const filteredData = data?.filter((item) =>
    columns.some((column) =>
      String(item[column.accessor])
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  const handleSelected = (item: T) => {
    setSelected(item);
  };

  const handleSave = () => {
    console.log("Selected:", selected);
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
                {title}
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
              {columns.map((item, key) => (
                <div key={key} className="col-span-2 border-b-2 border-black">
                  <span className="font-bold">{item.header}</span>
                </div>
              ))}
              <div></div>
            </div>
            <div className="grid grid-cols-8 gap-5 cursor-pointer">
              {filteredData.map((item, key) => (
                <React.Fragment key={key}>
                  {columns.map((column, colIndex) => (
                    <div
                      key={colIndex}
                      className="col-span-2 border-b-2 border-gray">
                      <span>{item[column.accessor] as ReactNode}</span>
                    </div>
                  ))}
                  <div className="flex justify-end items-center">
                    <input
                      type="radio"
                      onChange={() => handleSelected(item)}
                    />
                  </div>
                </React.Fragment>
              ))}
            </div>
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

export default ModalPicker;
