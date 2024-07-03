/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@providers/loading";

import { RequestReturn } from "../../__generated__/graphql";
import {
  ASSIGNMENT_STATUS,
  REQUEST_RETURN_STATUS,
  SORT_ORDER,
} from "../../types/enum.type";
import Paginate from "@components/paginate";
import Filter from "@components/filter";
import { convertEnumToMap } from "@utils/enumToMap";
import Search from "@components/search";
import CustomDatePicker from "@components/datepicker";
import ReusableList from "@components/list";
// import DetailAssignment from "./detail";
import EmptyComponent from "@components/empty";
import { checkSortOrder } from "@utils/checkSortField";

interface ViewRequestReturnProps {
  listData: RequestReturn[];
  sortOrder: SORT_ORDER;
  sortBy: string;
  setSortBy: (value: any) => void;
  setSortOder: (value: any) => void;
  totalPages: number;
  currentPage: number;
}

const tableColumns = [
  { header: "No.", accessor: "id" as keyof RequestReturn, width: "5%" },
  {
    header: "Asset Code",
    accessor: `asset.assetCode` as keyof RequestReturn,
    width: "10%",
  },
  {
    header: "Asset Name",
    accessor: "asset.assetName" as keyof RequestReturn,
    width: "10%",
  },
  {
    header: "Requested By",
    accessor: "requestedBy.username" as keyof RequestReturn,
    width: "11%",
  },
  {
    header: "Assigned Date",
    accessor: "assignedDate" as keyof RequestReturn,
    width: "12%",
  },
  {
    header: "Accepted By",
    accessor: "acceptedBy.username" as keyof RequestReturn,
    width: "10%",
  },
  {
    header: "Returned Date",
    accessor: "returnedDate" as keyof RequestReturn,
    width: "13%",
  },
  { header: "State", accessor: "state" as keyof RequestReturn, width: "13%" },
  { header: "icon", accessor: "" as keyof RequestReturn, width: "10%" },
];

const ViewRequestReturn: FC<ViewRequestReturnProps> = (props) => {
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

  const [selected, setSelected] = useState<RequestReturn>();
  const [showModalDetail, setShowModalDetail] = useState(false);

  const handleSortClick = (item: string) => {
    switch (item) {
      case "asset.assetCode":
        let defaultOrder = checkSortOrder(sortBy, item, sortOrder);
        setSortOder(defaultOrder);
        setSortBy("assetCode");
        break;
      case "asset.assetName":
        setSortBy("assetName");
        break;
      case "requestedBy.username":
        setSortBy("requestedBy");
        break;
      case "acceptedBy.username":
        setSortBy("acceptedBy");
        break;
      default:
        setSortBy(item);
        break;
    }
  };

  const handleRowClick = (ass: RequestReturn) => {
    setSelected(ass);
    setShowModalDetail(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-nashtech">Request List</h2>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-2">
          <div className="relative w-auto flex flex-row items-center justify-start gap-3">
            <Filter
              label="State"
              data={convertEnumToMap(REQUEST_RETURN_STATUS)}
            />
            <CustomDatePicker name="returnedDate" label="Returned Date" />
          </div>
        </div>
        <div className="flex gap-3">
          <Search />
        </div>
      </div>
      <ReusableList
        columns={tableColumns}
        data={listData}
        onRowClick={handleRowClick}
        onSortClick={handleSortClick}
        onCheckClick={() => {}}
        onDeleteClick={() => {}}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
      {listData?.length > 0 ? (
        <Paginate currentPage={currentPage} totalPages={totalPages} />
      ) : (
        <EmptyComponent />
      )}
    </div>
  );
};

export default ViewRequestReturn;
