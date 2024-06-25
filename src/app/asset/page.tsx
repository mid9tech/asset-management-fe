"use client";
import { useLoading } from "@providers/loading";
import { Fragment,Suspense, useEffect, useState } from "react";
import { SORT_ORDER, USER_TYPE } from "../../types/enum.type";
import { formatDate } from "@utils/timeFormat";
import { loadData, loadDetail } from "@services/user";
import { Asset, User } from "../../__generated__/graphql";
import AssetManagement from "./table";
// import AssetManagement from "./table";
export const dynamic = "force-dynamic";

export default function Index({
  searchParams,
}: {
  searchParams?: {
    Type?: string;
    query?: string;
  };
}) {
  const { setLoading }: any = useLoading();
  const [listAsset, setListAssets] = useState<Asset[]>();
  console.log('params', searchParams);
  const filterType = searchParams?.Type || "";
  const queryString = searchParams?.query || "";
  const [sortOrder, setSortOder] = useState(SORT_ORDER.ASC);
  const [sortBy, setSortBy] = useState("assetName");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totlaPage, setTotalPages] = useState<number>();
  const [newestAssetId, setNewestAssetId] = useState<string>("0");

  useEffect(() => {
    const newUserId = JSON.parse(localStorage.getItem("newUserId") || "0");
    setNewestAssetId(newUserId);
  }, []);

  useEffect(() => {
    setLoading(true);
    loadUserList();
  }, [queryString, filterType, sortBy, sortOrder, currentPage, newestAssetId]);

  const loadUserList = async () => {
    let request: { [k: string]: any } = {};
    request.page = currentPage;
    request.sort = sortBy;
    request.sortOrder = sortOrder;
    if (queryString) {
      request.query = queryString;
    }
    if (filterType) {
      if (filterType === USER_TYPE.ALL) {
        delete request.type;
      } else {
        request.type = filterType;
      }
    }
    const { data }: any = await loadData(request);

    const listUserCustome = data?.users.map(
      (item: {
        type: USER_TYPE;
        lastName: any;
        firstName: any;
        joinedDate: any;
        dateOfBirth: any;
      }) => ({
        ...item,
        fullName: `${item.lastName} ${item.firstName}`,
        dateOfBirth: formatDate(new Date(item.dateOfBirth)),
        joinedDate: formatDate(new Date(item.joinedDate)),
        type: item.type === USER_TYPE.STAFF ? "STAFF" : item.type,
      })
    );

    if (newestAssetId !== "0" && newestAssetId) {
      const newestUserIndex = listUserCustome.findIndex(
        (user: User) => user.id === newestAssetId
      );

      if (newestUserIndex !== -1) {
        const [newestUser] = listUserCustome.splice(newestUserIndex, 1);
        listUserCustome.unshift(newestUser);
      } else {
        const currentAdmin = JSON.parse(localStorage.getItem("user") || "{}");
        const { data: newUserDetail } = await loadDetail(Number(newestAssetId));
        const { data: currentAdminDetail } = await loadDetail(
          Number(currentAdmin.id)
        );
        if (
          newUserDetail &&
          currentAdminDetail.location == newUserDetail.location
        ) {
          listUserCustome.unshift({
            ...newUserDetail,
            fullName: `${newUserDetail.lastName} ${newUserDetail.firstName}`,
            dateOfBirth: formatDate(
              new Date(parseInt(newUserDetail.dateOfBirth))
            ),
            joinedDate: formatDate(
              new Date(parseInt(newUserDetail.joinedDate))
            ),
            type:
              newUserDetail.type === USER_TYPE.STAFF
                ? "STAFF"
                : newUserDetail.type,
          });
          if (listUserCustome.length > 20) {
            listUserCustome.pop();
          }
        }
      }

      localStorage.setItem("newUserId", JSON.stringify("0"));
    }

    setCurrentPage(data.page);
    setTotalPages(data.totalPages);
    setListAssets(listUserCustome);
    setLoading(false);
  };
  return (
    <Fragment>
    <Suspense >
      <AssetManagement
        data={listAsset as Asset[]}
        totalPages={totlaPage as number}
        currentPage={currentPage}
        sortBy={sortBy}
        sortOrder={sortOrder}
        setSortBy={setSortBy}
        setSortOder={setSortOder}
        setCurrentPage={setCurrentPage}
      />
    </Suspense>
  </Fragment>
  );
}
