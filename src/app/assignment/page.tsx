'use client'
import { Fragment, useState } from "react";
import ViewAssignment from "./view";

export default function Index() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  return (
    <Fragment>
      <ViewAssignment setCurrentPage={setCurrentPage} />
    </Fragment>
  );
}
