/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import DetailModal from "@components/modal";
import ReusableTable from "@components/table";
import { disableUser } from "@services/user";
import { convertEnumToMap } from "@utils/enumToMap";
import Filter from "@components/filter";
import { useLoading } from "@providers/loading";
import Search from "@components/search";

import { SORT_ORDER, USER_TYPE } from "../../types/enum.type";
import { User } from "../../__generated__/graphql";
import { formatDate } from "../../utils/timeFormat";
import Pagination from "@components/pagination";
import { Button } from "@components/ui/button";
import { toast } from "react-toastify";

interface UserManagementProps {
  data: User[];
  totalPages: number;
  currentPage: number;
  sortOrder: SORT_ORDER;
  sortBy: string;
  setSortBy: (value: any) => void;
  setSortOder: (value: any) => void;
  setCurrentPage: (value: number) => void;
}

const userColumns = [
  { header: "Staff Code", accessor: "staffCode" as keyof User },
  { header: "Full Name", accessor: "fullName" as keyof User },
  { header: "Username", accessor: "username" as keyof User },
  { header: "Joined Date", accessor: "joinedDate" as keyof User },
  { header: "Type", accessor: "type" as keyof User },
];

const UserManagement: React.FC<UserManagementProps> = (props) => {
  const {
    data,
    totalPages,
    currentPage,
    sortOrder,
    sortBy,
    setSortBy,
    setSortOder,
    setCurrentPage,
  } = props;
  const [showModalRemoveUser, setShowModalRemoveUser] = useState(false);
  const [showModalDetailUser, setShowModalDetailUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [listUser, setListUsers] = useState<User[] | []>();
  const [dataUpdate, setDataUpdate] = useState<User | User[] | null>(null);

  const router = useRouter();
  const { setLoading }: any = useLoading();

  const handleNavigateEditUser = (user: User) => {
    setLoading(true);
    setDataUpdate(user);
    router.push(`/user/${user.id}`);
};
  const handleSortClick = (item: string) => {
    let defaultOrder = SORT_ORDER.ASC;
    if (sortBy === item || (sortBy === "firstName" && item === "fullName")) {
      defaultOrder =
        sortOrder === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC;
    }
    setSortOder(defaultOrder);
    if (item === "fullName") {
      setSortBy("firstName");
    } else {
      setSortBy(item);
    }
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setShowModalRemoveUser(true);
  };

  const handleCloseModal = () => {
    setShowModalRemoveUser(false);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      const response = await disableUser(parseInt(selectedUser?.id as string));
      if(response) {
        setShowModalRemoveUser(false);
        toast.success("Disable User Successfully");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error disabling user:", error);
    }
  };

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setShowModalDetailUser(true);
  };

  const handleCloseDetailModal = () => {
    setShowModalDetailUser(false);
  };

  const handleNavigateCreateUser = () => {
    setLoading(true);
    router.push("user/create");
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4 text-nashtech">User List</h2>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="relative w-32">
              <Filter
                setCurrentPage={setCurrentPage}
                label="Type"
                data={convertEnumToMap(USER_TYPE)}
              />
            </div>
          </div>
          <div className="flex gap-10">
            <Search setCurrentPage={setCurrentPage} />
            <button
              className="bg-red-600 text-white rounded px-4 py-1 cursor-pointer"
              onClick={handleNavigateCreateUser}>
              Create new user
            </button>
          </div>
        </div>
        <ReusableTable
          columns={userColumns}
          data={data ?? []}
          onRowClick={handleRowClick}
          onDeleteClick={handleDeleteClick}
          onSortClick={handleSortClick}
          onEditClick={ handleNavigateEditUser}
          sortBy={sortBy === "firstName" ? "fullName" : sortBy}
          sortOrder={sortOrder}
        />
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
      <DetailModal
        isOpen={showModalRemoveUser}
        onClose={handleCloseModal}
        isShowCloseIcon={true}
        title="Are you sure ?">
        <div className="p-3">
          <div className="sm:flex sm:items-start">
            <p className="text-md text-gray-500">
              Do you want to disable this user?
            </p>
          </div>
        </div>
        <div className="sm:flex sm:flex-row gap-4">
          <Button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
            onClick={handleConfirmDelete}>
            Disable
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => setShowModalRemoveUser(false)}>
            Cancel
          </Button>
        </div>
      </DetailModal>
      {selectedUser && (
        <DetailModal
          isOpen={showModalDetailUser}
          onClose={handleCloseDetailModal}
          title="Detailed User Information">
          <div className="text-gray">
            <div className="flex mb-2">
              <span className="text-sm w-40">Staff Code:</span>{" "}
              <span className="text-sm">{selectedUser.staffCode}</span>
            </div>
            <div className="flex mb-2">
              <span className="text-sm w-40">Full Name:</span>{" "}
              <span className="text-sm">
                {selectedUser.lastName} {selectedUser.firstName}
              </span>
            </div>
            <div className="flex mb-2">
              <span className="text-sm w-40">Username:</span>{" "}
              <span className="text-sm">{selectedUser.username}</span>
            </div>
            <div className="flex mb-2">
              <span className="text-sm w-40">Date of Birth:</span>{" "}
              <span className="text-sm">
                {formatDate(new Date(selectedUser.dateOfBirth))}
              </span>
            </div>
            <div className="flex mb-2">
              <span className="text-sm w-40">Gender:</span>{" "}
              <span className="text-sm">{selectedUser.gender}</span>
            </div>
            <div className="flex mb-2">
              <span className="text-sm w-40">Joined Date:</span>{" "}
              <span className="text-sm">
                {formatDate(new Date(selectedUser.joinedDate))}
              </span>
            </div>
            <div className="flex mb-2">
              <span className="text-sm w-40">Type:</span>{" "}
              <span className="text-sm">{selectedUser.type}</span>
            </div>
            <div className="flex mb-2">
              <span className="text-sm w-40">Location:</span>{" "}
              <span className="text-sm">{selectedUser.location}</span>
            </div>
          </div>
        </DetailModal>
      )}
    </>
  );
};

export default UserManagement;
