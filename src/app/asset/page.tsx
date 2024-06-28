/* eslint-disable react-hooks/exhaustive-deps */
"use client";
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
import { usePushUp } from "./pushUp";
import { formatAsset } from "./formatAsset";
import { usePathname, useRouter } from "next/navigation";

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
  const router = useRouter();
  const pathname = usePathname();
  const { setLoading }: any = useLoading();
  const [listAsset, setListAssets] = useState<Asset[]>([]);
  const filterState = searchParams?.State || null;
  if (!filterState) {
    const defaultState = [
      ASSET_TYPE.Assigned,
      ASSET_TYPE.Available,
      ASSET_TYPE.Not_available,
    ];
    const params = new URLSearchParams();
    console.log("params: ", params);
    defaultState.forEach((state) => {
      params.append("State", state);
    });
    router.replace(`${pathname}?${params.toString()}`);
  }
  const filterCategory = searchParams?.Category || null;
  const currentPage = searchParams?.page || "1";


  const queryString = searchParams?.query || "";
  const [sortOrder, setSortOrder] = useState(SORT_ORDER.ASC);
  const [sortBy, setSortBy] = useState("assetCode");
  const [totalPage, setTotalPages] = useState<number>(0);
  const [newestAssetId, setNewestAssetId] = useState<string>("0");
  const { pushUpId, pushUp }: any = usePushUp();

  useEffect(() => {
    const newAssetId = JSON.parse(localStorage.getItem("newAssetId") || "0");
    setNewestAssetId(newAssetId);
  }, []);

  useEffect(() => {
    setLoading(true);
    loadAssetList();
  }, [searchParams, sortOrder]);

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

      let detail: any = null;
      //push item up
      if (pushUpId) {
        request.limit = 19;
        detail = await loadDetailAsset(pushUpId);
      }

      console.log("pushupid: ", pushUpId);

      const { data }: any = await loadDataAsset(request);

      const listAssetCustom = data?.assets.map((item: Asset) =>
        formatAsset(item)
      );

      if (detail && request?.page === 1) {
        const newAssetIndex = listAssetCustom.findIndex(
          (asset: Asset) => asset.id === pushUpId.toString()
        );
        if (newAssetIndex !== -1) {
          listAssetCustom.splice(newAssetIndex, 1);
        }
        detail.installedDate = parseInt(detail?.installedDate);
        console.log(detail);
        listAssetCustom.unshift(formatAsset(detail));
      } else {
        pushUp(null);
      }
      setTotalPages(data?.totalPages);
      setListAssets(listAssetCustom);
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
          data={listAsset as Asset[]}
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
