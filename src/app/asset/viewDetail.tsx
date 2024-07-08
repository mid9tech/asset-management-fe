import React, { Fragment } from "react";
import DetailModal from "@components/modal";
import { historyColumns } from "./tableColumn";
import TableComponent from "@components/table";

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
              <span className="text-sm w-28">Asset Code</span>{" "}
              <span className="text-sm w-96">{selectedAsset.assetCode}</span>
            </div>
            <div className="flex mb-2">
              <span className="text-sm w-28">Asset Name</span>{" "}
              <span className="text-sm w-96">{selectedAsset.assetName}</span>
            </div>
            <div className="flex mb-2 overflow-y-auto">
              <span className="text-sm w-28">Category</span>{" "}
              <span className="text-sm w-96 break-words">
                {selectedAsset.category.categoryName}
              </span>
            </div>
            <div className="flex mb-2">
              <span className="text-sm w-28">Installed Date</span>{" "}
              <span className="text-sm w-96">
                {selectedAsset.installedDate}
              </span>
            </div>
            <div className="flex mb-2">
              <span className="text-sm w-28">State</span>{" "}
              <span className="text-sm w-96">{selectedAsset.state}</span>
            </div>
            <div className="flex flex-row mb-2">
              <span className="text-sm w-28">Location</span>{" "}
              <span className="text-sm w-96">{selectedAsset.location}</span>
            </div>
            <div className="flex flex-row mb-2">
              <span className="text-sm w-28">Specification</span>{" "}
              <span className="text-sm w-96 break-words">
                {selectedAsset.specification}
              </span>
            </div>
            <div className="flex mb-2">
              <span className="text-sm w-28">History</span>{" "}
              {selectedAsset.history?.length > 0 ? (
                <div className="text-sm w-96 max-h-40 overflow-scroll">
                  <TableComponent
                    fontSize={12}
                    columns={historyColumns}
                    data={selectedAsset.history}
                    onRowClick={() => {}}
                    onSortClick={() => {}}
                    sortBy={"returnedDate"}
                    sortOrder={"asc"}
                  />
                </div>
              ) : (
                <div className="text-sm w-96">...</div>
              )}
            </div>
          </div>
        </DetailModal>
      )}
    </Fragment>
  );
};

export default ViewDetail;
