import { Assignment } from "../../../__generated__/graphql";

export const tableColumns = [
  {
    header: "No.",
    accessor: "id" as keyof Assignment,
    width: "5%",
    sortField: "id",
  },
  {
    header: "Asset Code",
    accessor: "assetCode" as keyof Assignment,
    width: "10%",
    sortField: "assetCode",
  },
  {
    header: "Asset Name",
    accessor: "assetName" as keyof Assignment,
    width: "21%",
    sortField: "assetName",
  },
  {
    header: "Assigned To",
    accessor: "assignedToUsername" as keyof Assignment,
    width: "11%",
    sortField: "assignedToUsername",
  },
  {
    header: "Assigned By",
    accessor: "assignedByUsername" as keyof Assignment,
    width: "11%",
    sortField: "assignedByUsername",
  },
  {
    header: "Assigned Date",
    accessor: "assignedDate" as keyof Assignment,
    width: "12%",
    sortField: "assignedDate",
  },
  {
    header: "State",
    accessor: "state" as keyof Assignment,
    width: "15%",
    sortField: "state",
  },
  { header: "icon", accessor: "" as keyof Assignment, width: "10%" },
];
