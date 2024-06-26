'use client'
import { gql, useQuery } from "@apollo/client";
import { useLoading } from "@providers/loading";
import { Fragment, Suspense, useEffect, useState } from "react";
import { ASSET_TYPE, SORT_ORDER } from "../../types/enum.type";
import { formatDate } from "@utils/timeFormat";
import { Asset } from "../../__generated__/graphql";
import AssetManagement from "./table";
import { loadDataAsset, loadDetailAsset } from "@services/asset";
import { GET_CATEGORY_QUERY } from "@services/query/category.query";

export const dynamic = "force-dynamic";
export default function Index({
  searchParams,
}: {
  searchParams?: {
    State?: string[];
    Category?: string[];
    query?: string;
  };
}) {
  const { setLoading }: any = useLoading();
  const [listAsset, setListAssets] = useState<Asset[]>([]);
  const filterState = searchParams?.State || "All"; 
  const filterCategory = searchParams?.Category || "All"; 
  const queryString = searchParams?.query || "";
  const [sortOrder, setSortOrder] = useState(SORT_ORDER.ASC);
  const [sortBy, setSortBy] = useState("assetCode");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPages] = useState<number>(0);
  const [newestAssetId, setNewestAssetId] = useState<string>("0");

  const { data: categoryData, loading: categoryLoading } = useQuery(GET_CATEGORY_QUERY);

  useEffect(() => {
    const newAssetId = JSON.parse(localStorage.getItem("newAssetId") || "0");
    setNewestAssetId(newAssetId);
  }, []);

  useEffect(() => {
    setLoading(true);
    loadAssetList();
  }, [queryString, filterState, filterCategory, sortBy, sortOrder, currentPage, newestAssetId, categoryData]);

  const loadAssetList = async () => {
    try {
      setLoading(true);
  
      let request: { [k: string]: any } = {};
      request.page = currentPage;
      request.sortField = sortBy;
      request.sortOrder = sortOrder;
  
      if (queryString) {
        request.query = queryString;
      }
  
      // if (filterState && filterState !== ASSET_TYPE.All) {
      //   request.stateFilter = filterState;
      // }
  
      let categoryId;
      // if (filterCategory && filterCategory !== 'ALL') {
      //   const category = categoryData?.getCategories.find(
      //     (cat: any) => cat.categoryName === filterCategory
      //   );
      //   categoryId = category ? category.id : null;
      //   if (categoryId) {
      //     request.categoryFilter = parseInt(categoryId, 10);
      //   }
      // }
  
      const { data }: any = await loadDataAsset(request);
      console.log("data table: ", data);
  
      if (data && data.assets) {
        const categoryMap = categoryData?.getCategories.reduce((map: any, category: any) => {
          map[category.id] = category.categoryName;
          return map;
        }, {});
  
        const listAssetCustom = data.assets.map((item: Asset) => ({
          ...item,
          assetName: `${item.assetName}`,
          installedDate: formatDate(new Date(item.installedDate)),
          category: categoryMap[item.categoryId] || item.categoryId,
          state: item.state === ASSET_TYPE.Available ? "AVAILABLE" : item.state,
        }));
  
        if (newestAssetId !== "0" && newestAssetId) {
          const newestAssetIndex = listAssetCustom.findIndex(
            (asset: Asset) => asset.id === newestAssetId
          );
  
          if (newestAssetIndex !== -1) {
            const [newestAsset] = listAssetCustom.splice(newestAssetIndex, 1);
            listAssetCustom.unshift(newestAsset);
          } else {
            const currentAdmin = JSON.parse(localStorage.getItem("asset") || "{}");
            const { data: newAssetDetail } = await loadDetailAsset(Number(newestAssetId));
            const { data: currentAdminDetail } = await loadDetailAsset(
              Number(currentAdmin.id)
            );
            if (
              newAssetDetail &&
              currentAdminDetail.location === newAssetDetail.location
            ) {
              listAssetCustom.unshift({
                ...newAssetDetail,
                assetName: `${newAssetDetail.assetName}`,
                category: categoryMap[newAssetDetail.categoryId] || newAssetDetail.categoryId,
                installedDate: newAssetDetail.installedDate,
                state:
                  newAssetDetail.state === ASSET_TYPE.Available
                    ? "AVAILABLE"
                    : newAssetDetail.state,
              });
              if (listAssetCustom.length > 20) {
                listAssetCustom.pop();
              }
            }
          }
  
          localStorage.setItem("newAssetId", JSON.stringify("0"));
        }
  
        setCurrentPage(data.page ?? 1);
        setTotalPages(data.totalPages ?? 1);
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

  console.log("categoryData: ", categoryData);

  return (
    <Fragment>
      <Suspense>
        <AssetManagement
          data={listAsset}
          totalPages={totalPage}
          currentPage={currentPage}
          sortBy={sortBy}
          sortOrder={sortOrder}
          setSortBy={setSortBy}
          setSortOrder={setSortOrder}
          setCurrentPage={setCurrentPage}
        />
      </Suspense>
    </Fragment>
  );
}
