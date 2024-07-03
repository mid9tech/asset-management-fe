/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Fragment, useEffect, useState } from "react";
import ViewAssignment from "./view";
import { Assignment, RequestReturn } from "../../__generated__/graphql";
import { gettAllAssignment, loadDetailAssignment } from "@services/assignment";
import { useLoading } from "@providers/loading";
import { ASSIGNMENT_STATUS, SORT_ORDER } from "../../types/enum.type";
import { formatStateText } from "@utils/formatText";
import { formatDate } from "@utils/timeFormat";
// import { usePushUp } from "./pushUp";
import { loadDetailAsset } from "@services/asset";
import ViewRequestReturn from "./view";
// import { formatAssignment } from "./formatAssignment";

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
  // const { pushUpId, pushUp }: any = usePushUp()
  const { setLoading }: any = useLoading();
  const [listData, setListData] = useState<RequestReturn[]>();

  const queryString = searchParams?.query || "";
  const state = searchParams?.State || "";
  const assignedDate = searchParams?.assignedDate || "";
  const currentPage = searchParams?.page || "1";

  const [sortOrder, setSortOder] = useState(SORT_ORDER.ASC);
  const [totlaPage, setTotalPages] = useState<number>();
  const [sortBy, setSortBy] = useState("assetName");

  useEffect(() => {
    handleGetAllReuqestReturn();
    // pushUp(null)

  }, [sortBy, sortOrder, searchParams]);

  const handleGetAllReuqestReturn = async () => {
    // setLoading(true);
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
    //push item up

    let detail: any = null;
    // if (pushUpId) {
    //   detail = await loadDetailReuqestReturn(pushUpId);
    // }
    // const { data }: any = await gettAllReuqestReturn(request);

    // if (data) {
    //   const listCustom = data?.assignments.map((item: Assignment) => (formatAssignment(item)));

    //   if (detail) {
    //     console.log(listCustom)
    //     const index = listCustom.findIndex(
    //       (assignment: Assignment) => assignment.id === pushUpId
    //     );
    //     console.log(index)

    //     if (index !== -1) {
    //       listCustom.splice(index, 1);
    //     }
    //     detail.assignedByUsername = detail.assigner?.username;
    //     detail.assignedToUsername = detail.assignee?.username;
    //     detail.state = formatStateText(detail.state);
    //     detail.assignedDate = formatDate(parseInt(detail.assignedDate));
    //     listCustom.unshift(detail);
    //   } else {
    //     pushUp(null);
    //   }
    //   setListData(listCustom);
    //   setTotalPages(data.totalPages);
    //   setLoading(false);
    // }
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