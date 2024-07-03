/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Fragment, useEffect, useState } from "react";
import { Assignment, RequestReturn } from "../../__generated__/graphql";
import { useLoading } from "@providers/loading";
import { SORT_ORDER } from "../../types/enum.type";
// import { usePushUp } from "./pushUp";
import ViewRequestReturn from "./view";
import { loadDataRequest } from "@services/requestForReturn";
import { formatRequestReturn } from "./formatRequestReturn";
import { toast } from "react-toastify";
// import { formatAssignment } from "./formatAssignment";

export default function Index({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    State?: string;
    returnedDate?: string;
    page?: string;
  };
}) {
  // const { pushUpId, pushUp }: any = usePushUp()
  const { setLoading }: any = useLoading();
  const [listData, setListData] = useState<RequestReturn[]>();

  const queryString = searchParams?.query || "";
  const type = searchParams?.State || "";
  const returnedDate = searchParams?.returnedDate || "";
  const currentPage = searchParams?.page || "1";

  const [sortOrder, setSortOder] = useState(SORT_ORDER.ASC);
  const [totlaPage, setTotalPages] = useState<number>();
  const [sortBy, setSortBy] = useState("updatedAt");

  useEffect(() => {
    handleGetAllReuqestReturn();
  }, [sortBy, sortOrder, searchParams]);

  const handleGetAllReuqestReturn = async () => {
    setLoading(true);
    let request: { [k: string]: any } = {};

    request.page = parseInt(currentPage);
    request.sortField = sortBy;
    request.sortOrder = sortOrder;

    if (queryString) {
      request.query = queryString;
    }

    if (returnedDate) {
      request.returnedDateFilter = new Date(returnedDate);
    }

    if (type) {
      request.stateFilter = type;
    }
    try {
      const { data }: any = await loadDataRequest(request);

      if (data) {
        const listCustom = data?.requestReturns.map((item: RequestReturn) =>
          formatRequestReturn(item)
        );
        setListData(listCustom);
        setTotalPages(data.totalPages);
        setLoading(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
      setLoading(false);
    }
  };
  return (
    <Fragment>
      <ViewRequestReturn
        listData={listData as RequestReturn[]}
        totalPages={totlaPage as number}
        currentPage={parseInt(currentPage)}
        sortBy={sortBy}
        sortOrder={sortOrder}
        setSortBy={setSortBy}
        setSortOder={setSortOder}
      />
    </Fragment>
  );
}
