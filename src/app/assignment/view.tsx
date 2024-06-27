/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { FC } from "react";
import { useRouter } from "next/navigation";

import Pagination from "@components/pagination";
import ReusableTable from "@components/table";
import { useLoading } from "@providers/loading";

import { Assignment } from "../../__generated__/graphql";
import { ASSIGNMENT_STATUS, SORT_ORDER } from "../../types/enum.type";
import Paginate from "@components/paginate";
import Filter from "@components/filter";
import { convertEnumToMap } from "@utils/enumToMap";

interface ViewAssignmentProps {
  listData: Assignment[];
  setCurrentPage: (value: number) => void;
  sortOrder: SORT_ORDER;
  sortBy: string;
  setSortBy: (value: any) => void;
  setSortOder: (value: any) => void;
  totalPages: number;
  currentPage: number;
}

const tableColumns = [
  { header: "Asset Code", accessor: "assetCode" as keyof Assignment },
  { header: "Asset Name", accessor: "assetName" as keyof Assignment },
  { header: "Assigned To", accessor: "assignedToUsername" as keyof Assignment },
  { header: "Assigned By", accessor: "assignedByUsername" as keyof Assignment },
  { header: "Assigned Date", accessor: "assignedDate" as keyof Assignment },
  { header: "State", accessor: "state" as keyof Assignment },
];

const ViewAssignment: FC<ViewAssignmentProps> = (props) => {
  const {
    listData,
    totalPages,
    currentPage,
    setSortBy,
    setSortOder,
    sortOrder,
    sortBy,
  } = props;
  const route = useRouter();
  const { setLoading }: any = useLoading();

  const handleNavigateCreate = () => {
    setLoading(true);
    route.push("assignment/create");
    setLoading(false);
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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-nashtech">Assignment List</h2>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="relative w-32">
            <Filter label="State" data={convertEnumToMap(ASSIGNMENT_STATUS)} />
          </div>
        </div>
        <div className="flex gap-10">
          {/* <Search setCurrentPage={setCurrentPage} /> */}
          <button
            className="bg-red-600 text-white rounded px-4 py-1 cursor-pointer hover:opacity-75"
            onClick={handleNavigateCreate}>
            Create new assignment
          </button>
        </div>
      </div>
      <ReusableTable
        columns={tableColumns}
        data={listData}
        onRowClick={() => {}}
        onDeleteClick={() => {}}
        onSortClick={handleSortClick}
        onEditClick={() => {}}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
      <Paginate currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
};

export default ViewAssignment;
