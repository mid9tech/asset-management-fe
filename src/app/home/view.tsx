import React, { FC, useState } from "react";
import { useLoading } from "@providers/loading";
import { Assignment } from "../../__generated__/graphql";
import { ASSIGNMENT_STATUS, SORT_ORDER } from "../../types/enum.type";
import Paginate from "@components/paginate";
import EmptyComponent from "@components/empty";
import DetailOwnAssignment from "./detail";
import ModalConfirmDeclineAssignment from "./components/modal/confirmDecline";
import ModalConfirmAcceptAssignment from "./components/modal/confirmAccept";
import CreateIcon from "@mui/icons-material/Create";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ReplayIcon from "@mui/icons-material/Replay";
import { toast } from "react-toastify";
import { tableColumns } from "./tableColumn";
import { UpdateStatusAssignmentService } from "@services/assignment";
import TableComponent from "@components/table";
import { formatStateText } from "@utils/formatText";
import { formatDate } from "@utils/timeFormat";
import CheckIcon from "@mui/icons-material/Check";
import { useMutation } from "@apollo/client";
import { CREATE_REQUEST_RETURN } from "@services/query/requestReturn.query";
import ModalConfirmCreateRequestReturn from "./components/modal/confirmCreate";
import { useRouter } from "next/navigation";

interface ViewAssignmentProps {
  listData: Assignment[];
  sortOrder: SORT_ORDER;
  sortBy: string;
  setSortBy: (value: any) => void;
  setSortOder: (value: any) => void;
  totalPages: number;
  currentPage: number;
}

const ViewOwnAssignment: FC<ViewAssignmentProps> = (props) => {
  const {
    listData,
    totalPages,
    currentPage,
    setSortBy,
    setSortOder,
    sortOrder,
    sortBy,
  } = props;
  const { setLoading }: any = useLoading();
  const route = useRouter();

  const [selected, setSelected] = useState<Assignment | null>();
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [showModalConfirmDecline, setShowModalConfirmDecline] = useState(false);
  const [showModalConfirmAccept, setShowModalConfirmAccept] = useState(false);

  const [requestReturn] = useMutation(CREATE_REQUEST_RETURN);
  const [showModalConfirmCreate, setShowModalConfirmCreate] = useState(false);

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

    try {
      setLoading(true);

      const result = await UpdateStatusAssignmentService({
        state: ASSIGNMENT_STATUS.ACCEPTED,
        id: selected?.id,
      });

      if (result) {
        setShowModalConfirmAccept(false);
        toast.success("Accept Assignment Successfully");
        route.refresh();
      } else {
        toast.error("Failed to accept the assignment. Please try again.");
      }
    } catch (error: any) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDecline = async () => {
    if (selected?.id === undefined) {
      toast.error("Selected assignment ID is undefined. Please try again.");
      return;
    }

    try {
      setLoading(true);

      const result = await UpdateStatusAssignmentService({
        state: ASSIGNMENT_STATUS.DECLINED,
        id: selected?.id,
      });

      if (result) {
        setShowModalConfirmDecline(false);
        toast.success("Decline Assignment Successfully");
        route.refresh();
      } else {
        toast.error("Failed to accept the assignment. Please try again.");
      }
    } catch (error: any) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (selected) {
      await onSubmit(selected);
      setShowModalConfirmCreate(false);
      setSelected(null);
    }
  };

  const onSubmit = async (item: any) => {
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
      route.refresh();
      console.log("Request return created: ", data.createRequestReturn);
    } catch (error: any) {
      const errorMessage =
        error.graphQLErrors?.[0]?.message || "Something went wrong";
      toast.error(errorMessage);
      console.error("Error creating request return: ", error);
    }
  };

  const checkReturn = (item: Assignment) => {
    if (item.isWaitingReturning || item.state === ASSIGNMENT_STATUS.WAITING_FOR_ACCEPTANCE){
      return true;
    }
    return false;
  }

  const newListData = listData?.map((item) => ({
    ...item,
    state:
      item.isWaitingReturning === true
        ? "Waiting for returning"
        : formatStateText(item.state),
    assignedDate: formatDate(new Date(item.assignedDate)),
    actions: [
      {
        icon: (
          <CheckIcon
            style={item.state !== ASSIGNMENT_STATUS.WAITING_FOR_ACCEPTANCE ? {
              color: 'gray', cursor: 'not-allowed' 
            } : {color: '#cf2338'} }
            onClick={(e) => {
              e.stopPropagation();
              item.state === ASSIGNMENT_STATUS.WAITING_FOR_ACCEPTANCE &&
                handleAcceptAssignment(item);
            }}
          />
        ),
      },
      {
        icon: (
          <HighlightOffIcon
          style={item.state !== ASSIGNMENT_STATUS.WAITING_FOR_ACCEPTANCE ? {
            color: 'gray', cursor: 'not-allowed' 
          } : {color: '#cf2338'} }
            onClick={(e) => {
              e.stopPropagation();
              item.state === ASSIGNMENT_STATUS.WAITING_FOR_ACCEPTANCE &&
                handleDeclineAssignment(item);
            }}
          />
        ),
      },
      {
        icon: (
          <ReplayIcon
            style={checkReturn(item) ? {
              color: 'gray', cursor: 'not-allowed' 
            } : {color: 'blue'} }
            onClick={(e) => {
              if(!item.isWaitingReturning){
                e.stopPropagation();
                if (item.state === ASSIGNMENT_STATUS.ACCEPTED) {
                  setSelected(item);
                  setShowModalConfirmCreate(true);
                }
              }
              
            }}
          />
        ),
      },
    ],
  }));



  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-nashtech">My Assignment</h2>
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
          handleConfirmDecline={handleConfirmDecline}
        />
      )}

      {selected && (
        <ModalConfirmAcceptAssignment
          showModalConfirm={showModalConfirmAccept}
          setShowModalConfirm={setShowModalConfirmAccept}
          handleConfirmAccept={handleConfirmAccept}
        />
      )}

      {selected && (
        <ModalConfirmCreateRequestReturn
          showModal={showModalConfirmCreate}
          setShowModal={setShowModalConfirmCreate}
          handleConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

export default ViewOwnAssignment;
