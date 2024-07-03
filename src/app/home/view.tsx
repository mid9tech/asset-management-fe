import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@providers/loading";
import { Assignment } from "../../__generated__/graphql";
import { SORT_ORDER } from "../../types/enum.type";
import Paginate from "@components/paginate";
import EmptyComponent from "@components/empty";
import DetailOwnAssignment from "./detail";
import ModalConfirmDeclineAssignment from "./components/modal/confirmDecline";
import ModalConfirmAcceptAssignment from "./components/modal/confirmAccept";
import HomeList from "./components/table/homeList";
import { useMutation } from "@apollo/client";
import { UPDATE_STATUS_ASSIGNMENT, updateStatusAssignment } from "@services/query/assignment.query";
import { toast } from "react-toastify";

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
  const [changeStatus] = useMutation(UPDATE_STATUS_ASSIGNMENT);

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

  const handleConfirmAccept = async () => {
    if (selected?.id === undefined) {
      toast.error("Selected assignment ID is undefined. Please try again.");
      return;
    }

    console.log("selected: ",selected.id, selected.state);

    try {
      setLoading(true);
      // const acceptOptions = {
      //   variables: {
      //     id: selected.id,
      //     state: ASSIGNMENT_STATUS.ACCEPTED, 
      //   },
      // };
      const response = await updateStatusAssignment(selected?.id);
      console.log("res: ",response);
      

      if (response && response.data.updateStatusAssignment) {
        setShowModalConfirmAccept(false);
        toast.success("Accept Asset Successfully");
        reloadTableData(); 
      } else {
        toast.error("Failed to accept the assignment. Please try again.");
      }
    } catch (error: any) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-nashtech">My Assignment</h2>
      <HomeList
        columns={tableColumns}
        data={listData}
        onRowClick={handleRowClick}
        onDeleteClick={handleDeclineAssignment}
        onSortClick={handleSortClick}
        onEditClick={handleAcceptAssignment}
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
          handleConfirmAccept={handleConfirmAccept}
          reloadTableData={reloadTableData}
          id={selected.id as number}
        />
      )}
    </div>
  );
};

export default ViewOwnAssignment;
