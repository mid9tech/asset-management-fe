/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Fragment, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import CreateIcon from "@mui/icons-material/Create";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { disableUser } from "@services/user";
import { convertEnumToMap } from "@utils/enumToMap";
import Filter from "@components/filter";
import { useLoading } from "@providers/loading";
import Search from "@components/search";
import { SORT_ORDER, USER_TYPE } from "../../types/enum.type";
import { User } from "../../__generated__/graphql";
import { toast } from "react-toastify";
import DetailUser from "./detail";
import Paginate from "@components/paginate";
import ModalConfirmUser from "./modal/modalConfirm";
import ModalError from "./modal/modalError";
import ReusableList from "@components/list";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
}
  from "@components/ui/table";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { truncateParagraph } from "@utils/truncate";

interface UserManagementProps {
  data: User[];
  totalPages: number;
  currentPage: number;
  sortOrder: SORT_ORDER;
  sortBy: string;
  setSortBy: (value: any) => void;
  setSortOder: (value: any) => void;
  loadUserList: () => void;
}

const userColumns = [
  { header: "Staff Code", accessor: "staffCode" as keyof User, width: 120 },
  { header: "Full Name", accessor: "fullName" as keyof User, width: 250 },
  { header: "Username", accessor: "username" as keyof User, width: 150 },
  { header: "Joined Date", accessor: "joinedDate" as keyof User, width: 120 },
  { header: "Type", accessor: "type" as keyof User, width: 100 },
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
    loadUserList
  } = props;
  const [showModalRemoveUser, setShowModalRemoveUser] = useState(false);
  const [showModalDetailUser, setShowModalDetailUser] = useState(false);
  const [showModalError, setShowModalError] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [dataUpdate, setDataUpdate] = useState<User | User[] | null>(null);
  const router = useRouter();
  const { setLoading }: any = useLoading();

  const handleNavigateEditUser = (user: User) => {
    if (user.type == "Admin") return;
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

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      const response = await disableUser(parseInt(selectedUser?.id as string));
      if (response) {
        setShowModalRemoveUser(false);
        toast.success("Disable User Successfully");
        loadUserList();
        setLoading(false);
      }
    } catch (error: any) {
      setShowModalRemoveUser(false);
      setLoading(false);
      setShowModalError(true);
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
                label="Type"
                data={convertEnumToMap(USER_TYPE)}
                height={110}
              />
            </div>
          </div>
          <div className="flex gap-10">
            <Search />
            <button
              className="bg-red-600 text-white rounded px-4 py-1 cursor-pointer"
              onClick={handleNavigateCreateUser}>
              Create new user
            </button>
          </div>
        </div>
        {/* <ReusableList
          columns={userColumns}
          data={data ?? []}
          onRowClick={handleRowClick}
          onDeleteClick={(e) => handleDeleteClick(e)}
          onSortClick={handleSortClick}
          onEditClick={handleNavigateEditUser}
          sortBy={sortBy === "firstName" ? "fullName" : sortBy}
          sortOrder={sortOrder}
        /> */}
        <div>
          <div className="bg-white h-auto">
            <div>
              <div className="mt-5">
                <table className="w-full table-fixed">
                  {" "}
                  {/* Add table-fixed class */}
                  <thead>
                    <tr className="flex flex-row gap-3">
                      {userColumns.map((item, key) => (
                        <Fragment key={key}>
                          {item.header !== "icon" ? (
                            <th
                              className="border-b-2 border-black cursor-pointer text-sm flex items-start"
                              style={{ width: item.width || "auto" }} // Set column width
                              onClick={() => handleSortClick(item.accessor as string)}>
                              <span className="font-bold">
                                {item.header}
                                {sortBy === item.accessor &&
                                  sortOrder === SORT_ORDER.ASC ? (
                                  <ArrowDropUpIcon />
                                ) : (
                                  <ArrowDropDownIcon />
                                )}
                              </span>
                            </th>
                          ) : (
                            <th style={{ width: item.width || "auto" }}></th> // Set column width
                          )}
                        </Fragment>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data?.map((item, key: number) => (
                      <>
                        <tr
                          key={key}
                          className="flex flex-row gap-3 w-fit cursor-pointer mt-1 h-full"
                          onClick={() => handleRowClick(item)}>
                          {userColumns.map((column, colIndex) => (
                            <>
                              <td
                                key={colIndex}
                                style={{ width: column.width || "auto" }}
                                className={`text-sm h-full ${column.header === "icon"
                                  ? ""
                                  : "border-b-2 border-graycustom"
                                  } flex justify-start items-start h-full`}>
                                {column.header !== "icon" ? (
                                  column.accessor !== "id" ? (
                                    (truncateParagraph(item[column.accessor] as ReactNode as string, 25))
                                  ) : (
                                    key + 1
                                  )
                                ) : (
                                  <>

                                  </>
                                )}
                              </td>
                            </>
                          ))}
                          <div className="">
                            <CreateIcon
                              className={`text-gray-500 ${item.type === 'Admin' ? 'text-gray cursor-not-allowed' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNavigateEditUser(item);
                              }}
                            />
                            <button disabled={item.type === 'Admin'}>
                            <HighlightOffIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(item);
                              }}
                              sx={{ color: "#cf2338" }}
                              className={`text-gray-500 ${item.type === 'Admin' ? 'text-gray cursor-not-allowed' : ''}`}
                            />
                            </button>
                            
                          </div>
                        </tr>

                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {data?.length > 0 ? (
          <Paginate totalPages={totalPages} currentPage={currentPage} />
        ) : (
          ""
        )}
      </div>
      <ModalConfirmUser
        handleDisableUser={handleConfirmDelete}
        showModalConfirm={showModalRemoveUser}
        setShowModalConfirm={setShowModalRemoveUser}
      />
      <ModalError
        setShowModalConfirm={setShowModalError}
        showModalConfirm={showModalError}
      />
      {selectedUser && (
        <DetailUser
          showModalDetailUser={showModalDetailUser}
          handleCloseDetailModal={handleCloseDetailModal}
          user={selectedUser}
        />
      )}
    </>
  );
};

export default UserManagement;
