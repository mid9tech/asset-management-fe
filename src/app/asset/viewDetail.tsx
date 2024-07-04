import React, { Fragment } from "react";
import { Asset } from "../../__generated__/graphql";
import { useState } from "react";
import DetailModal from "@components/modal";
import { useQuery } from "@apollo/client";
import { GET_CATEGORY_QUERY } from "@services/query/category.query";
import { SORT_ORDER } from "../../types/enum.type";
import { truncateParagraph } from "@utils/truncate";
interface AssetManagementProps {
  data: Asset[];
  totalPages: number;
  currentPage: number;
  sortOrder: SORT_ORDER;
  sortBy: string;
  setSortBy: (value: any) => void;
  setSortOrder: (value: any) => void;
}

interface Props {
  asset: Asset;
  showModalDetailAsset: boolean;
  handleCloseDetailModal: () => void;
}
const ViewDetail = (props: any) => {
  // const [showModalDetailAsset, setShowModalDetailAsset] = useState(false);
  const { selectedAsset, showModalDetailAsset, setShowModalDetailAsset } =
    props;
  const handleCloseDetailModal = () => {
    setShowModalDetailAsset(false);
  };

  const { data: categoryData, loading: categoryLoading } =
    useQuery(GET_CATEGORY_QUERY);

  const categoryMap =
    categoryData?.getCategories.reduce(
      (map: { [key: string]: string }, category: any) => {
        map[category.id] = category.categoryName;
        return map;
      },
      {}
    ) || {};
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
              <span className="text-sm w-80 break-words">{selectedAsset.category}</span>
            </div>
            <div className="flex mb-2">
              <span className="text-sm w-40">Installed Date</span>{" "}
              <span className="text-sm w-80">{selectedAsset.installedDate}</span>
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
              <span className="text-sm w-80">
                {selectedAsset.specification}
              </span>
            </div>
            <div className="flex mb-2">
              <span className="text-sm w-40">History</span>{" "}
              <span className="text-sm w-80">...</span>
            </div>
          </div>
        </DetailModal>
      )}
    </Fragment>
  );
};

export default ViewDetail;
