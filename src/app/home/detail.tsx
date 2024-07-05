import DetailModal from "@components/modal";

import { Assignment, User } from "../../__generated__/graphql";
import { formatDate } from "@utils/timeFormat";
import { formatText } from "@utils/formatText";

interface Props {
  data: Assignment;
  showModalDetailUser: boolean;
  handleCloseDetailModal: () => void;
}
export default function DetailOwnAssignment({
  data,
  showModalDetailUser,
  handleCloseDetailModal,
}: Props) {
  return (
    <DetailModal
      isOpen={showModalDetailUser}
      onClose={handleCloseDetailModal}
      title="Detailed Assignment Information"
    >
     <div className="text-gray">
        <div className="flex flex-row mb-2">
          <span className="text-sm w-40">Asset Code:</span>{" "}
          <span className="text-sm w-80">{data.assetCode}</span>
        </div>
        <div className="flex mb-2">
          <span className="text-sm w-40">Asset Name:</span>{" "}
          <span className="text-sm w-80 break-words">{data.assetName}</span>
        </div>
        <div className="flex flex-row mb-2">
          <span className="text-sm w-40">Specification</span>{" "}
          <span className="text-sm w-80 break-words">{data.asset?.specification}</span>
        </div>
        <div className="flex mb-2">
          <span className="text-sm w-40">Assigned to:</span>{" "}
          <span className="text-sm w-80">{data.assignedToUsername}</span>
        </div>
        <div className="flex mb-2">
          <span className="text-sm w-40">Assigned by:</span>{" "}
          <span className="text-sm w-80">{data.assignedByUsername}</span>
        </div>
        <div className="flex mb-2">
          <span className="text-sm w-40">Assigned date:</span>{" "}
          <span className="text-sm w-80">{data.assignedDate}</span>
        </div>
        <div className="flex mb-2">
          <span className="text-sm w-40">State:</span>{" "}
          <span className="text-sm w-80">{data.state}</span>
        </div>
        <div className="flex flex-row mb-2">
          <span className="text-sm w-40">Note</span>{" "}
          <span className="text-sm w-80 break-words">{data?.note}</span>
        </div>
      </div>
    </DetailModal>
  );
}
