/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { SORT_ORDER } from "../../types/enum.type";
import { ReportElement } from "../../__generated__/graphql";
import Paginate from "@components/paginate";
import ReusableList from "@components/list";
import EmptyComponent from "@components/empty";
import dynamic from "next/dynamic";
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

const userColumns = [
  {
    header: "Category",
    accessor: "category_name" as keyof ReportElement,
    width: "20%",
  },
  {
    header: "Total",
    accessor: "total" as keyof ReportElement,
    width: "10%",
  },
  {
    header: "Assigned",
    accessor: "assigned" as keyof ReportElement,
    width: "10%",
  },
  {
    header: "Available",
    accessor: "available" as keyof ReportElement,
    width: "10%",
  },
  {
    header: "Not available",
    accessor: "not_available" as keyof ReportElement,
    width: "14%",
  },
  {
    header: "Waiting for recycling",
    accessor: "waiting_for_recycling" as keyof ReportElement,
    width: "16%",
  },
  {
    header: "Recycled",
    accessor: "recycled" as keyof ReportElement,
    width: "10%",
  },
];

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
        <h2 className="text-2xl font-bold mb-4 text-nashtech">Report</h2>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2"></div>
          <div className="flex gap-10">
            <ExportButton />
          </div>
        </div>
        <ReusableList
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
