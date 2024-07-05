/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@providers/loading";

import { Assignment } from "../../__generated__/graphql";
import { ASSIGNMENT_STATUS, SORT_ORDER } from "../../types/enum.type";
import Paginate from "@components/paginate";
import Filter from "@components/filter";
import { convertEnumToMap } from "@utils/enumToMap";
import Search from "@components/search";
import CustomDatePicker from "@components/datepicker";
import ReusableList from "@components/list";
import DetailAssignment from "./detail";
import EmptyComponent from "@components/empty";
import { deleteAssignment } from "@services/assignment";
import { toast } from "react-toastify";
import { LABEL_STATE } from "../../constants/label";
import { tableColumns } from "./tableColumn";
import ModalConfirmDeleteAssignment from "./modal/confirmDelete";
import TableComponent from "@components/table";
import { actionType } from "../../types/action.type";
import CreateIcon from "@mui/icons-material/Create";
import CheckIcon from "@mui/icons-material/Check";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ReplayIcon from "@mui/icons-material/Replay";
import { formatStateText } from "@utils/formatText";
import { Button } from "@components/ui/button";
import DetailModal from "@components/modal";
import { useMutation } from "@apollo/client";
import { CREATE_REQUEST_RETURN } from "@services/query/requestReturn.query";

interface ViewAssignmentProps {
  listData: Assignment[];
  sortOrder: SORT_ORDER;
  sortBy: string;
  setSortBy: (value: any) => void;
  setSortOder: (value: any) => void;
  totalPages: number;
  currentPage: number;
  reloadTableData: () => void;
}

const ViewAssignment: FC<ViewAssignmentProps> = (props) => {
  const {
    listData,
    totalPages,
    currentPage,
    setSortBy,
    setSortOder,
    sortOrder,
    sortBy,
    reloadTableData,
  } = props;
  const route = useRouter();
  const { setLoading }: any = useLoading();

  const [selected, setSelected] = useState<Assignment>();
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);

  const [showModalCancel, setShowModalCancel] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [requestReturn] = useMutation(CREATE_REQUEST_RETURN);

  const handleCloseCancelModal = () => {
    setShowModalCancel(false);
  };

  const handleConfirm = async () => {
    if (selectedItem) {
      await onSubmit(selectedItem);
      setShowModalCancel(false);
      setSelectedItem(null);
    }
  };
  const onSubmit = async (item: any) => {
    console.log("data item: ", item);

    try {
      const variables: any = {
        request: {
          assetId: parseInt(item.asset.id),
          assignmentId: parseInt(item.id),
          requestedById: parseInt(item.assignee.id),
          assignedDate: item.assignedDate,
        },
      };
      const { data } = await requestReturn({ variables });
      const successMessage =
        data.createRequestReturn?.message ||
        "Request return created successfully";
      toast.success(successMessage);
      console.log("Request return created: ", data.createRequestReturn);
    } catch (error: any) {
      const errorMessage =
        error.graphQLErrors?.[0]?.message || "Something went wrong";
      toast.error(errorMessage);
      console.error("Error creating request return: ", error);
    }
  };

  const handleNavigateCreate = () => {
    setLoading(true);
    route.push("assignment/create");
  };

  const handleSortClick = (item: string) => {
    let defaultOrder = SORT_ORDER.ASC;
    if (sortBy === item) {
      defaultOrder =
        sortOrder === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC;
    }
    setSortOder(defaultOrder);
    setSortBy(item);
  };

  const handleRowClick = (ass: Assignment) => {
    setSelected(ass);
    setShowModalDetail(true);
  };

  const handleCloseDetailModal = () => {
    setShowModalDetail(false);
  };

  const handleModalDeleteAssignment = (ass: Assignment) => {
    setSelected(ass);
    setShowModalConfirmDelete(true);
  };

  const handleCloseConfirmDeleteAssignment = () => {
    setShowModalConfirmDelete(false);
  };

  const handleNavigateEditPage = (item: Assignment) => {
    if (item.state === ASSIGNMENT_STATUS.ACCEPTED) return;
    setLoading(true);
    setSelected(item);
    route.push(`/assignment/${item.id}`);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const response = await deleteAssignment(selected?.id as number);
      if (response) {
        setShowModalConfirmDelete(false);
        toast.success("Delete Assignment Successfully");
        reloadTableData();
        setLoading(false);
      }
    } catch (error: any) {
      setShowModalConfirmDelete(false);
      setLoading(false);
    }
  };
  const newListData = listData?.map((item) => ({
    ...item,
    state: formatStateText(item.state),
    actions: [
      {
        icon: (
          <CreateIcon
            className={`${
              item.state !== ASSIGNMENT_STATUS.WAITING_FOR_ACCEPTANCE &&
              "text-gray cursor-not-allowed"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              item.state === ASSIGNMENT_STATUS.WAITING_FOR_ACCEPTANCE &&
                handleNavigateEditPage(item);
            }}
          />
        ),
      },
      {
        icon: (
          <HighlightOffIcon
            className={`${
              item.state !== ASSIGNMENT_STATUS.WAITING_FOR_ACCEPTANCE &&
              "text-gray cursor-not-allowed"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              item.state === ASSIGNMENT_STATUS.WAITING_FOR_ACCEPTANCE &&
                handleModalDeleteAssignment(item);
            }}
            sx={{ color: "red" }}
          />
        ),
      },
      {
        icon: (
          <ReplayIcon
            className={`${
              item.state !== ASSIGNMENT_STATUS.ACCEPTED &&
              "text-gray cursor-not-allowed"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (item.state === ASSIGNMENT_STATUS.ACCEPTED) {
                setSelectedItem(item);
                setShowModalCancel(true);
              }
            }}
            sx={{ color: "blue" }}
          />
        ),
      },
    ],
  }));
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-nashtech">Assignment List</h2>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-2">
          <div className="relative w-auto flex flex-row items-center justify-start gap-3">
            <Filter
              label={LABEL_STATE}
              data={convertEnumToMap(ASSIGNMENT_STATUS)}
            />
            <CustomDatePicker name="assignedDate" label="Assigned date" />
          </div>
        </div>
        <div className="flex gap-3">
          <Search />
          <button
            className="bg-red-600 text-white rounded px-4 py-1 cursor-pointer hover:opacity-75"
            onClick={handleNavigateCreate}>
            Create new assignment
          </button>
        </div>
      </div>
      <TableComponent
        columns={tableColumns}
        data={newListData}
        onRowClick={handleRowClick}
        onSortClick={handleSortClick}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
      {listData?.length > 0 ? (
        <Paginate currentPage={currentPage} totalPages={totalPages} />
      ) : (
        <EmptyComponent />
      )}

      {selected && (
        <DetailAssignment
          showModalDetailUser={showModalDetail}
          handleCloseDetailModal={handleCloseDetailModal}
          data={selected}
        />
      )}

      {selected && (
        <ModalConfirmDeleteAssignment
          showModalConfirm={showModalConfirmDelete}
          setShowModalConfirm={handleCloseConfirmDeleteAssignment}
          handleDelete={() => confirmDelete()}
        />
      )}
      <DetailModal
        isOpen={showModalCancel}
        onClose={handleCloseCancelModal}
        title="Are you sure?">
        <div className="bg-white sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <p className="text-md text-gray-500">
                Do you want to create a returning request for this asset?
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 sm:flex sm:flex-row-reverse gap-4">
          <Button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            onClick={handleCloseCancelModal}>
            Cancel
          </Button>
          <Button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
            onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </DetailModal>
    </div>
  );
};

export default ViewAssignment;
