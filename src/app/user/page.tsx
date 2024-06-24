/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useSearchParams } from "next/navigation";
import UserManagement from "./table";
import { useLoading } from "@providers/loading";
import { useEffect, useState } from "react";
import { SORT_ORDER, USER_TYPE } from "../../types/enum.type";
import { formatDate } from "@utils/timeFormat";
import { loadData } from "@services/user";
import { User } from "../../__generated__/graphql";
export const dynamic = "force-dynamic";

export default function Index() {
  const params = useSearchParams();
  const { setLoading }: any = useLoading();

  const [listUser, setListUsers] = useState<User[]>();

  let filterType = params.get("Type");
  let queryString = params.get("query");
  const [sortOrder, setSortOder] = useState(SORT_ORDER.ASC);
  const [sortBy, setSortBy] = useState("firstName");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totlaPage, setTotalPages] = useState<number>();

  useEffect(() => {
    setLoading(true);
    loadUserList();
  }, [queryString, filterType, sortBy, sortOrder, currentPage]);

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
    setCurrentPage(data.page);
    setTotalPages(data.totalPages);
    setListUsers(listUserCustome);
    setLoading(false);
  };

  return (
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
  );
}
