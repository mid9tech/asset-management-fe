import { Fragment } from "react";

export default function Index() {
  console.log(`Domain: ` + process.env.NEXT_PUBLIC_URL_SERVER)

  return (
    <Fragment>
      Home
    </Fragment>
  );
}
