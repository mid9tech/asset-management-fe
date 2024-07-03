/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DetailModal from "@components/modal";
import { convertEnumToMap } from "@utils/enumToMap";
import Filter from "@components/filter";
import { useLoading } from "@providers/loading";
import Search from "@components/search";
import { ASSET_TYPE, SORT_ORDER } from "../../types/enum.type";
import { Asset } from "../../__generated__/graphql";
import { Button } from "@components/ui/button";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CATEGORY_QUERY } from "@services/query/category.query";
import ViewDetail from "./viewDetail";
import Paginate from "@components/paginate";
import ReusableList from "@components/list";
import EmptyComponent from "@components/empty";
import { DISABLE_ASSET_QUERY } from "@services/query/asset.query";
import { toast } from "react-toastify";
import { LABEL_CATEGORY, LABEL_STATE } from "../../constants/label";
import { assetColumns } from "./tableColumn";

interface AssetManagementProps {
  data: Asset[];
  totalPages: number;
  currentPage: number;
  sortOrder: SORT_ORDER;
  sortBy: string;
  setSortBy: (value: any) => void;
  setSortOrder: (value: any) => void;
  loadAssetList: () => void;
}

interface Props {
  asset: Asset
  showModalDetailAsset: boolean
  handleCloseDetailModal: () => void

}


const AssetManagement: React.FC<AssetManagementProps> = (props) => {
  const {
    data,
    totalPages,
    currentPage,
    sortOrder,
    sortBy,
    setSortBy,
    setSortOrder,
    loadAssetList
  } = props;

  const [showModalRemoveAsset, setShowModalRemoveAsset] = useState(false);
  const [showModalErrorAsset, setShowModalErrorAsset] = useState(false);
  const [showModalDetailAsset, setShowModalDetailAsset] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [dataUpdate, setDataUpdate] = useState<Asset | Asset[] | null>(null);
  const [deleteAsset] = useMutation(DISABLE_ASSET_QUERY);

  const router = useRouter();
  const { setLoading }: any = useLoading();
  const { data: categoryData, loading: categoryLoading } =
    useQuery(GET_CATEGORY_QUERY);

  const handleNavigateEditAsset = (asset: Asset) => {
    setDataUpdate(asset);
    router.push(`/asset/${asset.id}`);
  }

  const handleSortClick = (item: string) => {
    let defaultOrder = SORT_ORDER.ASC;
    if (sortBy === item) {
      defaultOrder =
        sortOrder === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC;
    }
    setSortOrder(defaultOrder);
    setSortBy(item);
  };

  const handleDeleteClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowModalRemoveAsset(true);
  };

  const handleCloseModal = () => {
    setShowModalRemoveAsset(false);
  };

  const handleCloseModalAsset = () => {
    setShowModalErrorAsset(false);
  };

  const handleRowClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowModalDetailAsset(true);
  };

  const handleNavigateCreateAsset = () => {
    setLoading(true);
    router.push("asset/create");
    setLoading(false);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      const deleteOptions = {
        variables: {
          id: parseInt(selectedAsset?.id as string),
        },
      };
      const response = await deleteAsset(deleteOptions);
      console.log("delete response: ", response);

      if (response) {
        setShowModalRemoveAsset(false);
        toast.success("Delete Asset Successfully");
        router.refresh();
        setLoading(false);
      }
    } catch (error: any) {
      setShowModalRemoveAsset(false);
      setLoading(false);
      setShowModalErrorAsset(true);
    }
  };


  const convertToMap = (data: any): Map<string, string> => {
    const map = new Map<string, string>();
    for (let i = 0; i < data.length; i++) {
      map.set(data[i]?.categoryName, data[i]?.id);
    }
    return map;
  };
  return (
    <>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4 text-nashtech">Asset List</h2>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="relative w-70 flex">
              <div className="relative">
                <Filter
                  label={LABEL_STATE}
                  data={convertEnumToMap(ASSET_TYPE)}
                  height={170}
                />
              </div>

              <div className="ml-4">
                {categoryLoading ? (
                  <div>Loading...</div>
                ) : (
                  <Filter
                    label={LABEL_CATEGORY}
                    data={convertToMap(categoryData?.getCategories)}
                    height={300}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center gap-10">
            <Search />
            <button
              className="bg-red-600 text-white rounded px-4 py-1 cursor-pointer"
              onClick={handleNavigateCreateAsset}>
              Create new asset
            </button>
          </div>
        </div>
        <ReusableList
          columns={assetColumns}
          data={data}
          onRowClick={handleRowClick}
          onDeleteClick={handleDeleteClick}
          onSortClick={handleSortClick}
          onEditClick={handleNavigateEditAsset}
          sortBy={sortBy === "assetName" ? "assetCode" : sortBy}
          sortOrder={sortOrder}
        />
        {totalPages !== 0 ? (
          <Paginate totalPages={totalPages} currentPage={currentPage} />
        ) : (
          <EmptyComponent />
        )}
      </div>
      <DetailModal
        isOpen={showModalRemoveAsset}
        onClose={handleCloseModal}
        isShowCloseIcon={true}
        title="Are you sure ?">
        <div className="p-3">
          <div className="sm:flex sm:items-start">
            <p className="text-md text-gray-500">
              Do you want to delete this asset?
            </p>
          </div>
        </div>
        <div className="sm:flex sm:flex-row gap-4">
          <Button
            type="button"
            onClick={handleConfirmDelete}
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">
            Delete
          </Button>
          <Button
            variant="outline"
            type="button"
            className="text-gray"
            onClick={() => setShowModalRemoveAsset(false)}
            >
            Cancel
          </Button>
        </div>
      </DetailModal>
      <DetailModal
        isOpen={showModalErrorAsset}
        onClose={handleCloseModalAsset}
        // isShowCloseIcon={true}
        title="Cannot Delete asset">
        <div className="p-0">
          <div className="sm:flex sm:items-start">
            <p className="text-md text-gray-500">
              Cannot delete the asset because it belongs to one or more historical assignments.
              <div>
              If the asset is not able to be used anymore, please update its state in <a href="/asset" className="text-blue underline">Edit Asset page</a>
              </div>
            </p>
          </div>
        </div>
      </DetailModal>
      <ViewDetail
        selectedAsset={selectedAsset}
        setSelectedAsset={setSelectedAsset}
        showModalDetailAsset={showModalDetailAsset}
        setShowModalDetailAsset={setShowModalDetailAsset}
      />
    </>
  );
};

export default AssetManagement;
