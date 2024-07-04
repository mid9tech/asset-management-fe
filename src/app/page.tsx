import { redirect } from "next/navigation";
import { Fragment } from "react";

export default function Index() {

  redirect('/login')
  return (
    <Fragment>
      <h1>
        404 Not Found
      </h1>
    </Fragment>
  );
}