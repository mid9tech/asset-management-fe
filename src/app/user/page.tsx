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
import { useAuth } from "@providers/auth";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN } from "../../constants";
import { formatText } from "@utils/formatText";

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
  const [listUser, setListUsers] = useState<User[]>();
  const filterType = searchParams?.Type || "";
  const queryString = searchParams?.query || "";
  const [sortOrder, setSortOder] = useState(SORT_ORDER.ASC);
  const [sortBy, setSortBy] = useState("firstName");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totlaPage, setTotalPages] = useState<number>();
  const [newestUserId, setNewestUserId] = useState<string>("0");

  useEffect(() => {
    const newUserId = JSON.parse(localStorage.getItem("newUserId") || "0");
    setNewestUserId(newUserId);
  }, []);

  useLayoutEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if(!token) {
      redirect('/login');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadUserList();
  }, [queryString, filterType, sortBy, sortOrder, currentPage, newestUserId]);

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
      (item: User) => ({
        ...item,
        fullName: formatText(`${item.firstName} ${item.lastName}`),
        dateOfBirth: formatDate(new Date(item.dateOfBirth)),
        joinedDate: formatDate(new Date(item.joinedDate)),
        type: formatText(item.type === USER_TYPE.STAFF ? "STAFF" : item.type),
      })
    );

    if (newestUserId !== "0" && newestUserId) {
      const newestUserIndex = listUserCustome.findIndex(
        (user: User) => user.id === newestUserId
      );

      if (newestUserIndex !== -1) {
        const [newestUser] = listUserCustome.splice(newestUserIndex, 1);
        listUserCustome.unshift(newestUser);
      } else {
        const currentAdmin = JSON.parse(localStorage.getItem("user") || "{}");
        const { data: newUserDetail } = await loadDetail(Number(newestUserId));
        const { data: currentAdminDetail } = await loadDetail(
          Number(currentAdmin.id)
        );
        if (
          newUserDetail &&
          currentAdminDetail.location == newUserDetail.location
        ) {
          listUserCustome.unshift({
            ...newUserDetail,
            fullName: formatText(`${newUserDetail.firstName} ${newUserDetail.lastName}`),
            dateOfBirth: formatDate(
              new Date(parseInt(newUserDetail.dateOfBirth))
            ),
            joinedDate: formatDate(
              new Date(parseInt(newUserDetail.joinedDate))
            ),
            type:
             formatText(newUserDetail.type === USER_TYPE.STAFF
                ? "STAFF"
                : newUserDetail.type,)
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
    setListUsers(listUserCustome);
    setLoading(false);
  };
  return (
    <Fragment>
      <Suspense>
        <UserManagement
          data={listUser as User[]}
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
