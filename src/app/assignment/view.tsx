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
            onClick={handleNavigateCreate}
          >
            Create new assignment
          </button>
        </div>
      </div>
      <ReusableList
        columns={tableColumns}
        data={listData}
        onRowClick={handleRowClick}
        onDeleteClick={handleModalDeleteAssignment}
        onSortClick={handleSortClick}
        onEditClick={handleNavigateEditPage}
        onReturnClick={() => {}}
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
    </div>
  );
};

export default ViewAssignment;
