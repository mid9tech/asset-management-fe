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
import EmptyComponent from "@components/empty";
import DetailOwnAssignment from "./detail";
import ModalConfirmDeclineAssignment from "./components/modal/confirmDecline";
import ModalConfirmAcceptAssignment from "./components/modal/confirmAccept";

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

const tableColumns = [
  { header: "No.", accessor: "id" as keyof Assignment, width: "5%" },
  {
    header: "Asset Code",
    accessor: "assetCode" as keyof Assignment,
    width: "13%",
  },
  {
    header: "Asset Name",
    accessor: "assetName" as keyof Assignment,
    width: "15%",
  },
  {
    header: "Assigned To",
    accessor: "assignedToUsername" as keyof Assignment,
    width: "12%",
  },
  {
    header: "Assigned By",
    accessor: "assignedByUsername" as keyof Assignment,
    width: "12%",
  },
  {
    header: "Assigned Date",
    accessor: "assignedDate" as keyof Assignment,
    width: "13%",
  },
  { header: "State", accessor: "state" as keyof Assignment, width: "15%" },
  { header: "icon", accessor: "" as keyof Assignment, width: "10%" },
];

const ViewOwnAssignment: FC<ViewAssignmentProps> = (props) => {
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
  const [showModalConfirmDecline, setShowModalConfirmDecline] = useState(false);
  const [showModalConfirmAccept, setShowModalConfirmAccept] = useState(false);

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

  const handleDeclineAssignment = (ass: Assignment) => {
    setSelected(ass);
    setShowModalConfirmDecline(true);
  };

  const handleAcceptAssignment = (ass: Assignment) => {
    setSelected(ass);
    setShowModalConfirmAccept(true);
  };

  const handleNavigateEditPage = (item: Assignment) => {
    if (item.state === ASSIGNMENT_STATUS.ACCEPTED) return;
    setLoading(true);
    setSelected(item);
    route.push(`/assignment/${item.id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-nashtech">Assignment List</h2>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-2">
          <div className="relative w-auto flex flex-row items-center justify-start gap-3">
            <Filter label="State" data={convertEnumToMap(ASSIGNMENT_STATUS)} />
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
        onDeleteClick={handleDeclineAssignment}
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
        <DetailOwnAssignment
          showModalDetailUser={showModalDetail}
          handleCloseDetailModal={handleCloseDetailModal}
          data={selected}
        />
      )}

      {selected && (
        <ModalConfirmDeclineAssignment
          showModalConfirm={showModalConfirmDecline}
          setShowModalConfirm={setShowModalConfirmDecline}
          reloadTableData={reloadTableData}
          id={selected.id as number}
        />
      )}

      {selected && (
        <ModalConfirmAcceptAssignment
          showModalConfirm={showModalConfirmAccept}
          setShowModalConfirm={setShowModalConfirmAccept}
          reloadTableData={reloadTableData}
          id={selected.id as number}
        />
      )}
    </div>
  );
};

export default ViewOwnAssignment;
