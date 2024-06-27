/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { gql, useQuery } from "@apollo/client";
import { useLoading } from "@providers/loading";
import { Fragment, Suspense, useEffect, useState } from "react";
import { ASSET_TYPE, SORT_ORDER } from "../../types/enum.type";
import { formatDate } from "@utils/timeFormat";
import { Asset } from "../../__generated__/graphql";
import AssetManagement from "./table";
import { loadDataAsset, loadDetailAsset } from "@services/asset";
import { formatText } from "@utils/formatText";
import { defaultChoice } from "@components/filter";

export const dynamic = "force-dynamic";
export default function Index({
  searchParams,
}: {
  searchParams?: {
    State?: string[];
    Category?: string[];
    query?: string;
    page?: string;

  };
}) {
  const { setLoading }: any = useLoading();
  const [listAsset, setListAssets] = useState<Asset[]>([]);
  const filterState = searchParams?.State || null;
  const filterCategory = searchParams?.Category || null;
  const currentPage = searchParams?.page || '1';

  const queryString = searchParams?.query || "";
  const [sortOrder, setSortOrder] = useState(SORT_ORDER.ASC);
  const [sortBy, setSortBy] = useState("assetCode");
  const [totalPage, setTotalPages] = useState<number>(0);
  const [newestAssetId, setNewestAssetId] = useState<string>("0");


  useEffect(() => {
    const newAssetId = JSON.parse(localStorage.getItem("newAssetId") || "0");
    setNewestAssetId(newAssetId);
  }, []);

  useEffect(() => {
    setLoading(true);
    loadAssetList();
  }, [searchParams]);

  const loadAssetList = async () => {
    try {
      setLoading(true);

      let request: { [k: string]: any } = {};
      request.page = parseInt(currentPage);
      request.sortField = sortBy;
      request.sortOrder = sortOrder;
      request.stateFilter = filterState;

      if (queryString) {
        request.query = queryString;
      }
      if (filterCategory) {
        if (filterCategory.includes(defaultChoice)) {
          delete request.categoryFilter;
        } else {
          request.categoryFilter = filterCategory;
        }
      }
      console.log(request)

      const { data }: any = await loadDataAsset(request);
      if (data && data.assets) {
        const listAssetCustom = data.assets.map((item: Asset) => ({
          ...item,
          assetName: formatText(`${item.assetName}`),
          installedDate: formatDate(new Date(item.installedDate)),
           category: formatText(item?.category?.categoryName),
          state: formatText(item.state === ASSET_TYPE.Available ? "AVAILABLE" : item.state),
          isEditDisabled: item.state === 'ASSIGNED'
        }));
        setListAssets(listAssetCustom);
      } else {
        console.error("Failed to load assets: ", data);
      }
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
          data={listAsset}
          totalPages={totalPage}
          currentPage={parseInt(currentPage)}
          sortBy={sortBy}
          sortOrder={sortOrder}
          setSortBy={setSortBy}
          setSortOrder={setSortOrder}
        />
      </Suspense>
    </Fragment>
  );
}
