/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useDebouncedCallback } from "use-debounce";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { Button } from "@components/ui/button";
import { loadData } from "@services/user";
import SearchIcon from "@public/icon/search.svg";
import { useLoading } from "@providers/loading";
import Pagination from "@components/paginationByState";
import { toast } from "react-toastify";
import { User, FindUsersInput } from "../../../../__generated__/graphql";
import { SORT_ORDER, USER_TYPE } from "../../../../types/enum.type";
import TablePickerComponent from "@components/tablePicker";
import { formatText } from "@utils/formatText";

export const userColumns = [
  {
    header: "radio",
    accessor: "" as keyof User,
    width: "5%",
  },
  {
    header: "Staff Code",
    accessor: "staffCode" as keyof User,
    width: "20%",
    sortField: "staffCode",
  },
  {
    header: "Full Name",
    accessor: "fullName" as keyof User,
    width: "50%",
    sortField: "firstName",
  },
  {
    header: "Type",
    accessor: "type" as keyof User,
    width: "20%",
    sortField: "type",
  },
];
interface ModalPickerProps {
  isOpen: boolean;
  setOpenModal: (value: boolean) => void;
  setUserSelected: (value: User) => void;
}

const ModalUserPicker: React.FC<ModalPickerProps> = ({
  isOpen,
  setOpenModal,
  setUserSelected,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { setLoading }: any = useLoading();
  const [selected, setSelected] = useState<User>();
  const [listUser, setListUser] = useState<User[]>();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("firstName");
  const [sortOrder, setSortOrder] = useState<SORT_ORDER>(SORT_ORDER.ASC);
  const [currenPage, setCurrenPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);

  const handleSearch = (term: string) => {
    setCurrenPage(1);
    setSearchTerm(term);
  };

  const handleSortClick = (item: any) => {
    let defaultOrder = SORT_ORDER.ASC;
    if (sortBy === item) {
      defaultOrder =
        sortOrder === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC;
    }
    setSortOrder(defaultOrder);
    setSortBy(item);
  };

  const loadUserList = useDebouncedCallback(async (filter: FindUsersInput) => {
    try {
      const { data }: any = await loadData(filter);
      const listUserCustom = data?.users.map(
        (item: { type: USER_TYPE; lastName: any; firstName: any }) => ({
          ...item,
          fullName: `${item.firstName} ${item.lastName}`,
          type: formatText(item.type === USER_TYPE.STAFF ? "STAFF" : item.type) ,
        })
      );
      setTotalPage(data.totalPages);
      setListUser(listUserCustom);
    } catch (error) {
      toast.error("Something went wrong! Please try again");
    } finally {
      setLoading(false);
    }
  }, 300);

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
        page: currenPage,
        query: searchTerm,
        limit: 10,
        sort: sortBy,
        sortOrder: sortOrder,
      });

      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, searchTerm, sortBy, sortOrder, currenPage]);

  if (!isOpen) return null;

  const handleSelected = (item: User) => {
    setSelected(item);
  };

  const handleSave = () => {
    setUserSelected(selected as User);
    setOpenModal(false);
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white border border-black shadow-lg w-1/2 h-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-5">
          <div className="flex flex-row justify-between items-center">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 text-gradient font-bold">
                Select User
              </h3>
            </div>
            <div className="px-4 sm:px-6">
              <div className="relative w-52 h-full">
                <input
                  onChange={(e) => {
                    handleSearch(e.target.value);
                  }}
                  value={searchTerm || ""}
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
          <div className="flex flex-row justify-center">
            <TablePickerComponent
              selected={selected}
              columns={userColumns}
              data={listUser as User[]}
              onRowClick={handleSelected}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortClick={handleSortClick}
            />
          </div>
          <div className="flex justify-center">
            {totalPage > 1 && (
              <Pagination
                totalPages={totalPage}
                currentPage={currenPage}
                setCurrentPage={setCurrenPage}
              />
            )}
          </div>
          <div className="px-4 py-4 sm:px-6 flex justify-end gap-3">
            <Button
              disabled={!selected}
              className="bg-custom-gradient text-white"
              onClick={handleSave}>
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
