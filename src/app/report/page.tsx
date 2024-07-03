/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useLoading } from "@providers/loading";
import { Fragment, Suspense, useState } from "react";
import { SORT_ORDER } from "../../types/enum.type";
import { ReportElement } from "../../__generated__/graphql";
import { GetReportService } from "@services/report";
import ReportManagement from "./view";

export const dynamic = "force-dynamic";

export default function Index({
  searchParams,
}: {
  searchParams: {
    Type?: string[];
    query?: string;
    page?: string;
  };
}) {
  const { setLoading }: any = useLoading();
  const [listReportElement, setListReportElement] = useState<ReportElement[]>();
  const currentPage = searchParams?.page || "1";
  const [sortOrder, setSortOder] = useState(SORT_ORDER.ASC);
  const [sortBy, setSortBy] = useState("category_name");
  const [totalPages, setTotalPages] = useState<number>();

  const loadReport = async () => {
    let request: { [k: string]: any } = {};
    request.page = parseInt(currentPage);
    request.sort = sortBy;
    request.sortOrder = sortOrder;
    request.limit = 20;

    const data = await GetReportService({
      page: request.page,
      limit: request.limit,
      sort: request.sort,
      sortOrder: request.sortOrder,
    });

    //store data
    setTotalPages(data?.totalPages);
    setListReportElement(data?.data);
    setLoading(false);
  };

  loadReport();

  return (
    <Fragment>
      <Suspense>
        <ReportManagement
          data={listReportElement as ReportElement[]}
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
