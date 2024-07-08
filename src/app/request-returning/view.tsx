/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { FC, useState } from "react";
import { RequestReturn } from "../../__generated__/graphql";
import { REQUEST_RETURN_STATUS, SORT_ORDER } from "../../types/enum.type";
import Paginate from "@components/paginate";
import Filter from "@components/filter";
import { convertEnumToMap } from "@utils/enumToMap";
import Search from "@components/search";
import CustomDatePicker from "@components/datepicker";
import EmptyComponent from "@components/empty";
import { checkSortOrder } from "@utils/checkSortField";
import ModalCancelRequestReturn from "./components/model/cancel";
import ModalCompleteRequestReturn from "./components/model/complete";
import { toast } from "react-toastify";
import { useLoading } from "@providers/loading";
import {
  CancelRequestReturnService,
  CompleteReturningService,
} from "@services/requestForReturn";
import { tableColumns } from "./tableColumn";
import TableComponent from "@components/table";
import { formatStateText, formatText } from "@utils/formatText";
import { formatDate } from "@utils/timeFormat";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from '@mui/icons-material/Close';

interface ViewRequestReturnProps {
  listData: RequestReturn[];
  sortOrder: SORT_ORDER;
  sortBy: string;
  setSortBy: (value: any) => void;
  setSortOder: (value: any) => void;
  totalPages: number;
  currentPage: number;
  reloadTableData: () => void;
}

const ViewRequestReturn: FC<ViewRequestReturnProps> = (props) => {
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

  const { setLoading }: any = useLoading();
  const [selected, setSelected] = useState<RequestReturn>();
  const [showModalConfirmCancel, setShowModalConfirmCancel] = useState(false);
  const [showModalConfirmComplete, setShowModalConfirmComplete] =
    useState(false);

  const handleSortClick = (item: string) => {
    let defaultOrder = checkSortOrder(sortOrder);
    setSortOder(defaultOrder);
    setSortBy(item);
  };

  async function handleConfirmCancel(): Promise<void> {
    if (selected?.id === undefined) {
      toast.error("Selected request return ID is undefined. Please try again.");
      return;
    }

    try {
      setLoading(true);

      const result = await CancelRequestReturnService(selected?.id);

      if (result) {
        setShowModalConfirmCancel(false);
        toast.success("Cancel Request Returning Successfully");
        reloadTableData();
      } else {
        toast.error("Failed to cancel request returning. Please try again.");
      }
    } catch (error: any) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmComplete(): Promise<void> {
    if (selected?.id === undefined) {
      toast.error("Selected request return ID is undefined. Please try again.");
      return;
    }

    try {
      setLoading(true);

      const result = await CompleteReturningService(selected?.id);

      if (result) {
        setShowModalConfirmComplete(false);
        toast.success("Complete Request Returning Successfully");
        reloadTableData();
      } else {
        toast.error("Failed to complete request returning. Please try again.");
      }
    } catch (error: any) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCompleteModal(item: RequestReturn): void {
    setSelected(item);
    setShowModalConfirmComplete(true);
  }

  function handleOpenCancelModal(item: RequestReturn): void {
    setSelected(item);
    setShowModalConfirmCancel(true);
  }

  const newListData = listData?.map((item) => ({
    ...item,
    assignedDate: formatDate(new Date(item.assignedDate)),
    returnedDate: item.returnedDate
      ? formatDate(new Date(item.returnedDate))
      : null,
    state: formatStateText(item.state),
    actions: [
      {
        icon: (
          <CheckIcon
            style={item.state === REQUEST_RETURN_STATUS.COMPLETED ? {
              color: 'gray', cursor: 'not-allowed' 
            } : {color: '#cf2338'} }
            onClick={(e) => {
              e.stopPropagation();
              if (item.state !== REQUEST_RETURN_STATUS.COMPLETED) {
                handleOpenCompleteModal(item);
              }
            }}
          />
        ),
      },
      {
        icon: (
          <CloseIcon
            style={item.state === REQUEST_RETURN_STATUS.COMPLETED ? {
              color: 'gray', cursor: 'not-allowed' 
            } : {color: '#000'} }
            onClick={(e) => {
              e.stopPropagation();
              if (item.state !== REQUEST_RETURN_STATUS.COMPLETED) {
                handleOpenCancelModal(item);
              }
            }}
          />
        ),
      },
    ],
  }));

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
      <TableComponent
        columns={tableColumns}
        data={newListData}
        onRowClick={() => {}}
        onSortClick={handleSortClick}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
      {listData?.length > 0 ? (
        <Paginate currentPage={currentPage} totalPages={totalPages} />
      ) : (
        <EmptyComponent />
      )}

      <ModalCancelRequestReturn
        showModalConfirm={showModalConfirmCancel}
        setShowModalConfirm={setShowModalConfirmCancel}
        handleConfirmCancel={handleConfirmCancel}
      />

      <ModalCompleteRequestReturn
        showModalConfirm={showModalConfirmComplete}
        setShowModalConfirm={setShowModalConfirmComplete}
        handleConfirmComplete={handleConfirmComplete}
      />
    </div>
  );
};

export default ViewRequestReturn;
