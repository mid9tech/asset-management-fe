/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { SORT_ORDER } from "../../../types/enum.type";
import { ReportElement } from "../../../__generated__/graphql";
import Paginate from "@components/paginate";
import EmptyComponent from "@components/empty";
import dynamic from "next/dynamic";
import { userColumns } from "./tableColumns";
import TableComponent from "@components/table";
const ExportButton = dynamic(() => import("./exportButton"), { ssr: false });

interface UserManagementProps {
  data: ReportElement[];
  totalPages: number;
  currentPage: number;
  sortOrder: SORT_ORDER;
  sortBy: string;
  setSortBy: (value: any) => void;
  setSortOder: (value: any) => void;
}

const ReportManagement: React.FC<UserManagementProps> = (props) => {
  const {
    data,
    totalPages,
    currentPage,
    sortOrder,
    sortBy,
    setSortBy,
    setSortOder,
  } = props;

  const handleSortClick = (item: string) => {
    let defaultOrder = SORT_ORDER.ASC;
    if (sortBy === item || sortBy === "category_name") {
      defaultOrder =
        sortOrder === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC;
    }
    setSortOder(defaultOrder);
    setSortBy(item);
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold text-gradient">Report</h2>
            <ExportButton />
        </div>
        <TableComponent
          onRowClick={() => {}}
          columns={userColumns}
          data={data ?? []}
          onSortClick={handleSortClick}
          sortBy={sortBy === "firstName" ? "fullName" : sortBy}
          sortOrder={sortOrder}
        />
        {data?.length > 0 ? (
          <Paginate totalPages={totalPages} currentPage={currentPage} />
        ) : (
          <EmptyComponent />
        )}
      </div>
    </>
  );
};

export default ReportManagement;
