/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Fragment, useEffect, useState } from "react";
import ViewAssignment from "./view";
import { Assignment } from "../../__generated__/graphql";
import { gettAllAssignment } from "@services/assignment";
import { useLoading } from "@providers/loading";
import { SORT_ORDER } from "../../types/enum.type";
import { formatStateText } from "@utils/formatText";
import { formatDate } from "@utils/timeFormat";

export default function Index({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const { setLoading }: any = useLoading();
  const [listData, setListData] = useState<Assignment[]>();

  const queryString = searchParams?.query || "";
  const [sortOrder, setSortOder] = useState(SORT_ORDER.ASC);
  const [totlaPage, setTotalPages] = useState<number>();
  const [sortBy, setSortBy] = useState("assetName");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    handleGetAllAssignment();
  }, [sortBy, sortOrder, queryString]);

  const handleGetAllAssignment = async () => {
    setLoading(true);
    let request: { [k: string]: any } = {};

    request.page = currentPage;
    request.sort = sortBy;
    request.sortOrder = sortOrder;

    if (queryString) {
      request.query = queryString;
    }

    const { data }: any = await gettAllAssignment(request);
    if (data) {
      const lsitCustome = data?.assignments.map((item: Assignment) => ({
        ...item,
        state: formatStateText(item.state),
        assignedTo: item.assignee.username,
        assignedBy: item.assigner.username,
        assignedDate: formatDate(item.assignedDate),
      }));
      setListData(lsitCustome);
      setTotalPages(data.totalPages);
      setCurrentPage(data.page);
      setLoading(false);
    }
  };
  return (
    <Fragment>
      <ViewAssignment
        listData={listData as Assignment[]}
        setCurrentPage={setCurrentPage}
        totalPages={totlaPage as number}
        currentPage={currentPage}
        sortBy={sortBy}
        sortOrder={sortOrder}
        setSortBy={setSortBy}
        setSortOder={setSortOder}
      />
    </Fragment>
  );
}
