/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useLoading } from "@providers/loading";
import { Fragment, Suspense, useEffect, useState } from "react";
import { SORT_ORDER } from "../../types/enum.type";
import { Asset } from "../../__generated__/graphql";
import AssetManagement from "./view";
import { loadDataAsset, loadDetailAsset } from "@services/asset";
import { defaultChoice } from "@components/filter";
import { usePushUp } from "./pushUp";
import { formatAsset } from "./formatAsset";
import { usePathname, useRouter } from "next/navigation";
import { ASSET_PATH_DEFAULT } from "../../constants";
import { useQuery } from "@apollo/client";
import { GET_CATEGORY_QUERY } from "@services/query/category.query";

export const dynamic = "force-dynamic";
export default function Index({
  searchParams,
}: {
  searchParams?: {
    State?: string[];
    query?: string;
    page?: string;
  };
}) {
  const router = useRouter();
  const { setLoading }: any = useLoading();
  const [listAsset, setListAssets] = useState<Asset[]>([]);
  const filterState = searchParams?.State || [];
  const currentPage = searchParams?.page || "1";

  const queryString = searchParams?.query || "";
  const [sortOrder, setSortOrder] = useState(SORT_ORDER.ASC);
  const [sortBy, setSortBy] = useState("assetCode");
  const [totalPage, setTotalPages] = useState<number>(0);
  const { pushUpId, pushUp }: any = usePushUp();
  const { data: categoryData, loading: categoryLoading } = useQuery(GET_CATEGORY_QUERY);
  const [selectedStates, setSelectedStates] = useState<string[] | null>(null);
  useEffect(() => {
    setLoading(true);
    loadAssetList();
    pushUp(null);
  }, [searchParams, sortOrder, sortBy, selectedStates]);

  const loadAssetList = async () => {
    try {
      setLoading(true);
      let request: { [k: string]: any } = {};
      request.page = parseInt(currentPage);
      if (isNaN(request.page) || request.page < 1) {
        router.push(ASSET_PATH_DEFAULT);
        return;
      }
      request.sortField = sortBy;
      request.sortOrder = sortOrder;
      request.stateFilter = filterState;
      request.categoryFilter = selectedStates;

      if (queryString) {
        request.query = queryString;
      }

      let detail: any = null;
      //push item up
      if (pushUpId) {
        detail = await loadDetailAsset(pushUpId);
      }

      const { data }: any = await loadDataAsset(request);

      if (detail) {
        const newAssetIndex = data?.assets?.findIndex(
          (asset: Asset) => asset.id === pushUpId.toString()
        );
        if (newAssetIndex !== -1) {
          data?.assets?.splice(newAssetIndex, 1);
        }
        data?.assets.unshift(detail);
      } else {
        pushUp(null);
      }
      setTotalPages(data?.totalPages);
      setListAssets(data?.assets);
      setLoading(false);
    } catch (error) {
      console.error("Error loading assets: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Suspense>
        <AssetManagement
          selected={selectedStates}
          setSelected={setSelectedStates}
          data={listAsset as Asset[]}
          totalPages={totalPage}
          currentPage={parseInt(currentPage)}
          sortBy={sortBy}
          sortOrder={sortOrder}
          setSortBy={setSortBy}
          setSortOrder={setSortOrder}
          loadAssetList={loadAssetList}
          categories={categoryData?.getCategories || []}
        />
      </Suspense>
    </Fragment>
  );
}
