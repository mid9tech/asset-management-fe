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
import { useQuery } from "@apollo/client";
import { GET_CATEGORY_QUERY } from "@services/query/category.query";
import ViewDetail from "./viewDetail";
import Paginate from "@components/paginate";
import ReusableList from "@components/list";
import EmptyComponent from "@components/empty";

interface AssetManagementProps {
  data: Asset[];
  totalPages: number;
  currentPage: number;
  sortOrder: SORT_ORDER;
  sortBy: string;
  setSortBy: (value: any) => void;
  setSortOrder: (value: any) => void;
}

const assetColumns = [
  { header: "Asset Code", accessor: "assetCode" as keyof Asset, width: "10%" },
  { header: "Asset Name", accessor: "assetName" as keyof Asset, width: "40%" },
  { header: "Category", accessor: "category" as keyof Asset, width: "20%" },
  { header: "State", accessor: "state" as keyof Asset, width: "20%" },
  { header: "icon", accessor: "" as keyof Asset },
];

const historyColumns = [
  { header: "Date", accessor: "date" as keyof Asset },
  { header: "Assigned To", accessor: "assignedTo" as keyof Asset },
  { header: "Assigned By", accessor: "assignedBy" as keyof Asset },
  { header: "Returned Date", accessor: "returnedDate" as keyof Asset },
];

const AssetManagement: React.FC<AssetManagementProps> = (props) => {
  const {
    data,
    totalPages,
    currentPage,
    sortOrder,
    sortBy,
    setSortBy,
    setSortOrder,
  } = props;

  const [showModalRemoveAsset, setShowModalRemoveAsset] = useState(false);
  const [showModalDetailAsset, setShowModalDetailAsset] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [dataUpdate, setDataUpdate] = useState<Asset | Asset[] | null>(null);
  const router = useRouter();
  const { setLoading }: any = useLoading();
  const { data: categoryData, loading: categoryLoading } =
    useQuery(GET_CATEGORY_QUERY);

  const handleNavigateEditAsset = (asset: Asset) => {
    setDataUpdate(asset);
    router.push(`/asset/${asset.id}`);
  };

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

  const handleRowClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowModalDetailAsset(true);
  };

  const handleNavigateCreateAsset = () => {
    setLoading(true);
    router.push("asset/create");
    setLoading(false);
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
                  label="State"
                  data={convertEnumToMap(ASSET_TYPE)}
                  height={170}
                />
              </div>

              <div className="ml-4">
                {categoryLoading ? (
                  <div>Loading...</div>
                ) : (
                  <Filter
                    label="Category"
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
              Do you want to disable this asset?
            </p>
          </div>
        </div>
        <div className="sm:flex sm:flex-row gap-4">
          <Button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">
            Disable
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => setShowModalRemoveAsset(false)}>
            Cancel
          </Button>
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
