import DetailModal from "@components/modal";

import { Assignment } from "../../__generated__/graphql";

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
      {/* <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="text-sm w-40">Asset Code:</div>
          <div className="text-sm w-40">Asset Name:</div>
          <div className="text-sm w-40">Specification:</div>
          <div className="text-sm w-40">Assigned to:</div>
          <div className="text-sm w-40">Assigned by:</div>
          <div className="text-sm w-40">Assigned date:</div>
          <div className="text-sm w-40">State:</div>
          <div className="text-sm w-40">Note:</div>
        </div>
        <div className="flex flex-col gap-2">
        <div className="text-sm w-40">{data.assetCode}</div>
          <div className="text-sm w-40">{data.assetName}</div>
          <div className="text-sm w-40">{data.asset?.specification}</div>
          <div className="text-sm w-40">{data.assignedToUsername}</div>
          <div className="text-sm w-40">{data.assignedByUsername}</div>
          <div className="text-sm w-40">{data.assignedDate}</div>
          <div className="text-sm w-40">{data.state}</div>
          <div className="text-sm w-40">{data.note}</div>
        </div>
      </div> */}
      <div className="text-gray">
        <div className="flex flex-row mb-2">
          <span className="text-sm w-40">Asset Code:</span>{" "}
          <span className="text-sm w-80">{data.assetCode}</span>
        </div>
        <div className="flex mb-2">
          <span className="text-sm w-40">Asset Name:</span>{" "}
          <span className="text-sm w-80">{data.assetName}</span>
        </div>
        <div className="flex flex-row mb-2">
          <span className="text-sm w-40">Specification</span>{" "}
          <span className="text-sm w-80">{data.asset?.specification}</span>
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
          <span className="text-sm w-80">{data?.note}</span>
        </div>
      </div>
    </DetailModal>
  );
}
