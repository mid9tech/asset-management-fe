import DetailModal from "@components/modal";

import { Assignment, User } from "../../__generated__/graphql";
import { formatDate } from "@utils/timeFormat";
import { formatText } from "@utils/formatText";

interface Props {
  data: Assignment;
  showModalDetailUser: boolean;
  handleCloseDetailModal: () => void;
}
export default function DetailAssignment({
  data,
  showModalDetailUser,
  handleCloseDetailModal,
}: Props) {
  return (
    <DetailModal
      isOpen={showModalDetailUser}
      onClose={handleCloseDetailModal}
      title="Detailed Assignment Information">
      <div className="text-gray">
        <div className="flex mb-2">
          <span className="text-sm w-40">Asset Code:</span>{" "}
          <span className="text-sm">{data.assetCode}</span>
        </div>
        <div className="flex mb-2">
          <span className="text-sm w-40">Asset Name:</span>{" "}
          <span className="text-sm">{data.assetName}</span>
        </div>
        <div className="flex mb-2">
          <span className="text-sm w-40">Specification:</span>{" "}
          <span className="text-sm">{data.note}</span>
        </div>
        <div className="flex mb-2">
          <span className="text-sm w-40">Assigned to:</span>{" "}
          <span className="text-sm">{data.assignedToUsername}</span>
        </div>
        <div className="flex mb-2">
          <span className="text-sm w-40">Assigned by:</span>{" "}
          <span className="text-sm">{data.assignedByUsername}</span>
        </div>
        <div className="flex mb-2">
          <span className="text-sm w-40">Assigned date:</span>{" "}
          <span className="text-sm">{data.assignedDate}</span>
        </div>
        <div className="flex mb-2">
          <span className="text-sm w-40">State:</span>{" "}
          <span className="text-sm">{data.state}</span>
        </div>
        <div className="flex mb-2">
          <span className="text-sm w-40">Note:</span>{" "}
          <span className="text-sm">{data.note}</span>
        </div>
      </div>
    </DetailModal>
  );
}
