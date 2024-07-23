/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { disableUser } from "@services/user";
import { convertEnumToMap } from "@utils/enumToMap";
import Filter from "@components/filter";
import { useLoading } from "@providers/loading";
import Search from "@components/search";
import { SORT_ORDER, USER_TYPE } from "../../../types/enum.type";
import { User } from "../../../__generated__/graphql";
import { toast } from "react-toastify";
import DetailUser from "./detail";
import Paginate from "@components/paginate";
import ModalConfirmUser from "./modal/modalConfirm";
import ModalError from "./modal/modalError";
import EmptyComponent from "@components/empty";
import { LABEL_TYPE } from "../../../constants/label";
import { USER_PATH_DEFAULT } from "../../../constants";
import { userColumns } from "./userColumn";
import { checkSortOrder } from "@utils/checkSortField";
import TableComponent from "@components/table";
import { formatText } from "@utils/formatText";
import { formatDate } from "@utils/timeFormat";
import CreateIcon from "@mui/icons-material/Create";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

interface UserManagementProps {
  data: User[];
  totalPages: number;
  currentPage: number;
  sortOrder: SORT_ORDER;
  sortBy: string;
  setSortBy: (value: any) => void;
  setSortOder: (value: any) => void;
}

const UserManagement: React.FC<UserManagementProps> = (props) => {
  const {
    data,
    totalPages,
    currentPage,
    sortOrder,
    sortBy,
    setSortBy,
    setSortOder,
  } = props;
  const [showModalRemoveUser, setShowModalRemoveUser] = useState(false);
  const [showModalDetailUser, setShowModalDetailUser] = useState(false);
  const [showModalError, setShowModalError] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const router = useRouter();
  const { setLoading }: any = useLoading();

  const handleNavigateEditUser = (user: User) => {
    if (user.type == "Admin") return;
    setLoading(true);
    router.push(`/user/${user.id}`);
  };
  const handleSortClick = (item: string) => {
    let defaultOrder = checkSortOrder(sortOrder);
    setSortOder(defaultOrder);
    setSortBy(item);
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
        router.refresh();
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

  const newListData = data?.map((item) => ({
    ...item,
    fullName: formatText(`${item.firstName} ${item.lastName}`),
    dateOfBirth: formatDate(parseInt(item.dateOfBirth)),
    joinedDate: formatDate(parseInt(item.joinedDate)),
    type: formatText(item.type === USER_TYPE.STAFF ? "STAFF" : item.type),
    actions: [
      {
        icon: (
          <CreateIcon
            style={item.type === USER_TYPE.ADMIN ? {
              color: 'gray', cursor: 'not-allowed' 
            } : {} }
            onClick={(e) => {
              if (item.type === USER_TYPE.STAFF) {
                e.stopPropagation();
                handleNavigateEditUser(item);
              }
            }}
          />
        ),
      },
      {
        icon: (
          <HighlightOffIcon
            style={item.type === USER_TYPE.ADMIN ? {
              color: 'gray', cursor: 'not-allowed' 
            } : {color: '#cf2338'} }
            onClick={(e) => {
              if (item.type === USER_TYPE.STAFF) {
                e.stopPropagation();
                handleDeleteClick(item);
              }
            }}
          />
        ),
      },
    ],
  }));

  return (
    <>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4 text-gradient">User List</h2>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="relative w-auto">
              <Filter
                label={LABEL_TYPE}
                data={convertEnumToMap(USER_TYPE)}
                height={110}
              />
            </div>
          </div>
          <div className="flex gap-10">
            <Search />
            <button
              className="bg-custom-gradient text-white rounded px-4 py-1 cursor-pointer"
              onClick={handleNavigateCreateUser}>
              Create new user
            </button>
          </div>
        </div>
        <TableComponent
          onRowClick={handleRowClick}
          columns={userColumns}
          data={newListData}
          onSortClick={handleSortClick}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
        {data?.length > 0 ? (
          <Paginate totalPages={totalPages} currentPage={currentPage} />
        ) : (
          <EmptyComponent />
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
