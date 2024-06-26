import React from 'react'
import { Asset } from "../../__generated__/graphql";
import { useState } from "react";
import DetailModal from "@components/modal";
import { useQuery } from "@apollo/client";
import { GET_CATEGORY_QUERY } from "@services/query/category.query";
const ViewDetail = () => {
    const [showModalRemoveAsset, setShowModalRemoveAsset] = useState(false);
    const [showModalDetailAsset, setShowModalDetailAsset] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const handleCloseDetailModal = () => {
        setShowModalDetailAsset(false);
    };
    const { data: categoryData, loading: categoryLoading } = useQuery(GET_CATEGORY_QUERY);

    const categoryMap = categoryData?.getCategories.reduce((map: { [key: string]: string }, category: any) => {
        map[category.id] = category.categoryName;
        return map;
    }, {}) || {};
  return (
    <>
    {selectedAsset && (
                <DetailModal
                    isOpen={showModalDetailAsset}
                    onClose={handleCloseDetailModal}
                    title="Detailed Asset Information">
                    <div className="text-gray">
                        <div className="flex mb-2">
                            <span className="text-sm w-40">Asset Code</span>{" "}
                            <span className="text-sm">{selectedAsset.assetCode}</span>
                        </div>
                        <div className="flex mb-2">
                            <span className="text-sm w-40">Asset Name</span>{" "}
                            <span className="text-sm">
                                {selectedAsset.assetName}
                            </span>
                        </div>
                        <div className="flex mb-2">
                            <span className="text-sm w-40">Category</span>{" "}
                            <span className="text-sm">{categoryMap[selectedAsset.categoryId]}</span>
                        </div>
                        <div className="flex mb-2">
                            <span className="text-sm w-40">Installed Date</span>{" "}
                            <span className="text-sm">
                                {selectedAsset.installedDate}
                            </span>
                        </div>
                        <div className="flex mb-2">
                            <span className="text-sm w-40">Location</span>{" "}
                            <span className="text-sm">{selectedAsset.location}</span>
                        </div>
                        <div className="flex mb-2">
                            <span className="text-sm w-40">Specification</span>{" "}
                            <span className="text-sm">
                               {selectedAsset.specification}
                            </span>
                        </div>
                        <div className="flex mb-2">
                            <span className="text-sm w-40">History</span>{" "}
                            <span className="text-sm">
                                ...
                            </span>
                        </div>
                    </div>
                </DetailModal>
            )}
    </>
  )
}

export default ViewDetail