/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import UserManagement from "./table";
import { useLoading } from "@providers/loading";
import {
  Fragment,
  Suspense,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { SORT_ORDER, USER_TYPE } from "../../types/enum.type";
import { formatDate } from "@utils/timeFormat";
import { loadData, loadDetail } from "@services/user";
import { User } from "../../__generated__/graphql";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN } from "../../constants";
import { formatText } from "@utils/formatText";
import { usePushUp } from "./pushUp";
import { formatUser } from "./formatUser";

import { defaultChoice } from "@components/filter";


export const dynamic = "force-dynamic";

export default function Index({
  searchParams,
}: {
  searchParams?: {
    Type?: string[];
    query?: string;
    page?: string;
  };
}) {
  const { setLoading }: any = useLoading();
  const [listUser, setListUsers] = useState<User[]>();
  const filterType = searchParams?.Type || [];
  const queryString = searchParams?.query || "";
  const currentPage = searchParams?.page || '1';
  const [sortOrder, setSortOder] = useState(SORT_ORDER.ASC);
  const [sortBy, setSortBy] = useState("firstName");
  const [totalPages, setTotalPages] = useState<number>();
  const [newestUserId, setNewestUserId] = useState<string>("0");
  const { pushUpId, pushUp }: any = usePushUp()

  useEffect(() => {
    const newUserId = JSON.parse(localStorage.getItem("newUserId") || "0");
    setNewestUserId(newUserId);
  }, []);

  useEffect(() => {
    setLoading(true);
    loadUserList();
  }, [searchParams, sortBy, sortOrder]);
  const loadUserList = async () => {
    const newUserId = pushUpId
    let request: { [k: string]: any } = {};
    request.page = parseInt(currentPage);
    request.sort = sortBy;
    request.sortOrder = sortOrder;
    if (queryString) {
      request.query = queryString;
    }
    if (filterType) {
      if (filterType.includes(defaultChoice)) {
        delete request.type;
      } else {
        request.type = filterType;
      }
    }
    let detailUser: any = null;

    //push item up
    if (newUserId) {
      request.limit = 19
      detailUser = await loadDetail(newUserId);
    }

    const { data }: any = await loadData(request);
    const listUserCustome = data?.users.map(
      (item: User) => (formatUser(item))
    );
    if (detailUser) {
      const newUserIndex = listUserCustome.findIndex((user: User) => user.id === newUserId.toString());
      if (newUserIndex !== -1) {
        listUserCustome.splice(newUserIndex, 1);
      }
      detailUser.joinedDate = parseInt(detailUser?.joinedDate);
      detailUser.dateOfBirth = parseInt(detailUser?.dateOfBirth);
      console.log(detailUser)
      listUserCustome.unshift(formatUser(detailUser));
    } else {
      pushUp(null)
    }
    //store data
    setTotalPages(data?.totalPages);
    setListUsers(listUserCustome);
    setLoading(false);
  };
  return (
    <Fragment>
      <Suspense>
        <UserManagement
          data={listUser as User[]}
          totalPages={totalPages as number}
          currentPage={parseInt(currentPage)}
          sortBy={sortBy}
          sortOrder={sortOrder}
          setSortBy={setSortBy}
          setSortOder={setSortOder}
        />
      </Suspense>
    </Fragment>
  );
}
