import { RequestReturn } from "../../__generated__/graphql";

export const tableColumns = [
  {
    header: "No.",
    accessor: "id" as keyof RequestReturn,
    width: "5%",
    sortField: "id",
  },
  {
    header: "Asset Code",
    accessor: `asset.assetCode` as keyof RequestReturn,
    width: "10%",
    sortField: "assetCode",
  },
  {
    header: "Asset Name",
    accessor: "asset.assetName" as keyof RequestReturn,
    width: "10%",
    sortField: "assetName",
  },
  {
    header: "Requested By",
    accessor: "requestedBy.username" as keyof RequestReturn,
    width: "11%",
    sortField: "requestedBy",
  },
  {
    header: "Assigned Date",
    accessor: "assignedDate" as keyof RequestReturn,
    width: "12%",
    sortField: "assignedDate",
  },
  {
    header: "Accepted By",
    accessor: "acceptedBy.username" as keyof RequestReturn,
    width: "11%",
    sortField: "acceptedBy",
  },
  {
    header: "Returned Date",
    accessor: "returnedDate" as keyof RequestReturn,
    width: "13%",
    sortField: "returnedDate",
  },
  {
    header: "State",
    accessor: "state" as keyof RequestReturn,
    width: "12%",
    sortField: "state",
  },
  { header: "icon", accessor: "" as keyof RequestReturn, width: "10%" },
];
