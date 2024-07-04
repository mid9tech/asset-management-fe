import React, { Fragment } from "react";
import DetailModal from "@components/modal";
import ReusableList from "@components/list";
import { historyColumns } from "./tableColumn";

const ViewDetail = (props: any) => {
  // const [showModalDetailAsset, setShowModalDetailAsset] = useState(false);
  const { selectedAsset, showModalDetailAsset, setShowModalDetailAsset } =
    props;
  const handleCloseDetailModal = () => {
    setShowModalDetailAsset(false);
  };

  return (
    <Fragment>
      {selectedAsset && (
        <DetailModal
          isOpen={showModalDetailAsset}
          onClose={handleCloseDetailModal}
          title="Detailed Asset Information">
          <div className="text-gray">
            <div className="flex mb-2">
              <span className="text-sm w-40">Asset Code</span>{" "}
              <span className="text-sm w-80">{selectedAsset.assetCode}</span>
            </div>
            <div className="flex mb-2">
              <span className="text-sm w-40">Asset Name</span>{" "}
              <span className="text-sm w-80">{selectedAsset.assetName}</span>
            </div>
            <div className="flex mb-2 overflow-y-auto">
              <span className="text-sm w-40">Category</span>{" "}
              <span className="text-sm w-80 break-words">
                {selectedAsset.category.categoryName}
              </span>
            </div>
            <div className="flex mb-2">
              <span className="text-sm w-40">Installed Date</span>{" "}
              <span className="text-sm w-80">
                {selectedAsset.installedDate}
              </span>
            </div>
            <div className="flex mb-2">
              <span className="text-sm w-40">State</span>{" "}
              <span className="text-sm w-80">{selectedAsset.state}</span>
            </div>
            <div className="flex flex-row mb-2">
              <span className="text-sm w-40">Location</span>{" "}
              <span className="text-sm w-80">{selectedAsset.location}</span>
            </div>
            <div className="flex flex-row mb-2">
              <span className="text-sm w-40">Specification</span>{" "}
              <span className="text-sm w-80 break-words">
                {selectedAsset.specification}
              </span>
            </div>
            <div className="flex mb-2">
              <span className="text-sm w-40">History</span>{" "}
              <div className="text-sm w-80">
                <ReusableList
                  fontSize={12}
                  columns={historyColumns}
                  data={selectedAsset.history}
                  onRowClick={() => {}}
                  onSortClick={() => {}}
                  sortBy={"returnedDate"}
                  sortOrder={"asc"}
                />
              </div>
            </div>
          </div>
        </DetailModal>
      )}
    </Fragment>
  );
};

export default ViewDetail;
