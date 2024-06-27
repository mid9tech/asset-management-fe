"use client";
import { Fragment, useState } from "react";
import ViewAssignment from "./view";
import { Assignment } from "../../__generated__/graphql";
import { gettAllAssignment } from "@services/assignment";
import { useLoading } from "@providers/loading";

export default function Index() {
  const { setLoading }: any = useLoading();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [listData, setListData] = useState<Assignment[]>();

  const handleGetAllAssignment = async () => {
    setLoading(true);
    let request: { [k: string]: any } = {};

    const { data }: any = await gettAllAssignment(request);
    if (data) {
      setListData(data.assignments);
      setCurrentPage(data.page);
      setLoading(false);
    }
  };
  return (
    <Fragment>
      <ViewAssignment
        listData={listData as Assignment[]}
        setCurrentPage={setCurrentPage}
      />
    </Fragment>
  );
}
