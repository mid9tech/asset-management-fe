import React, { Fragment } from 'react'
import { Asset } from "../../__generated__/graphql";
import { useState } from "react";
import DetailModal from "@components/modal";
import { useQuery } from "@apollo/client";
import { GET_CATEGORY_QUERY } from "@services/query/category.query";
import { SORT_ORDER } from '../../types/enum.type';
import { truncateParagraph } from '@utils/truncate';
interface AssetManagementProps {
    data: Asset[];
    totalPages: number;
    currentPage: number;
    sortOrder: SORT_ORDER;
    sortBy: string;
    setSortBy: (value: any) => void;
    setSortOrder: (value: any) => void;
}
const ViewDetail = (props :any) => {
    // const [showModalDetailAsset, setShowModalDetailAsset] = useState(false);
    const {selectedAsset,showModalDetailAsset,setShowModalDetailAsset} = props;
    console.log("selected: ",selectedAsset);
    const handleCloseDetailModal = () => {
        setShowModalDetailAsset(false);
    };

    const { data: categoryData, loading: categoryLoading } = useQuery(GET_CATEGORY_QUERY);

    const categoryMap = categoryData?.getCategories.reduce((map: { [key: string]: string }, category: any) => {
        map[category.id] = category.categoryName;
        return map;
    }, {}) || {};
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
                            <span className="text-sm">{truncateParagraph(selectedAsset.assetCode,25)}</span>
                        </div>
                        <div className="flex mb-2">
                            <span className="text-sm w-40">Asset Name</span>{" "}
                            <span className="text-sm">
                                {truncateParagraph(selectedAsset.assetName,25)}
                            </span>
                        </div>
                        <div className="flex mb-2 overflow-y-auto">
                            <span className="text-sm w-40">Category</span>{" "}
                            <span className="text-sm">{truncateParagraph(selectedAsset.category,25)}</span>
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
                                {truncateParagraph(selectedAsset.specification,25)}
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
        </Fragment>
    )
}

export default ViewDetail