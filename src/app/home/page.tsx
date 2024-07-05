/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Fragment, useEffect, useState } from "react";
import { Assignment } from "../../__generated__/graphql";
import { getAllOwnAssignment } from "@services/assignment";
import { useLoading } from "@providers/loading";
import { SORT_ORDER } from "../../types/enum.type";
import ViewOwnAssignment from "./view";
import { formatAssignment } from "../assignment/formatAssignment";

export default function Index({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    State?: string;
    assignedDate?: string;
    page?: string;
  };
}) {
  const { setLoading }: any = useLoading();
  const [listData, setListData] = useState<Assignment[]>();

  const queryString = searchParams?.query || "";
  const state = searchParams?.State || "";
  const assignedDate = searchParams?.assignedDate || "";
  const currentPage = searchParams?.page || "1";

  const [sortOrder, setSortOder] = useState(SORT_ORDER.ASC);
  const [totlaPage, setTotalPages] = useState<number>();
  const [sortBy, setSortBy] = useState("assetName");

  useEffect(() => {
    handleGetAllAssignment();
  }, [sortBy, sortOrder, searchParams]);

  const handleGetAllAssignment = async () => {
    setLoading(true);
    let request: { [k: string]: any } = {};

    request.page = parseInt(currentPage);
    request.sort = sortBy;
    request.sortOrder = sortOrder;

    if (queryString) {
      request.query = queryString;
    }

    if (assignedDate) {
      request.assignedDate = assignedDate;
    }

    if (state) {
      request.state = state;
    }

    const { data }: any = await getAllOwnAssignment(request);

    if (data) {
      setListData(data?.assignments);
      setTotalPages(data.totalPages);
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <ViewOwnAssignment
        reloadTableData={handleGetAllAssignment}
        listData={listData as Assignment[]}
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
