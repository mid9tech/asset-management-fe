import { Asset } from "../../__generated__/graphql";

export const assetColumns = [
  { header: "Asset Code", accessor: "assetCode" as keyof Asset, width: "15%", sortField: 'assetCode' },
  { header: "Asset Name", accessor: "assetName" as keyof Asset, width: "40%", sortField: 'assetName' },
  { header: "Category", accessor: "category" as keyof Asset, width: "20%", sortField: 'category' },
  { header: "State", accessor: "state" as keyof Asset, width: "15%", sortField: 'state' },
  { header: "icon", accessor: "" as keyof Asset },
];
export const historyColumns = [
  {
    header: "Date",
    accessor: "assignment.assignedDate" as keyof Asset,
    width: "10%",
  },
  {
    header: "Assigned To",
    accessor: "assignment.assignedToUsername" as keyof Asset,
    width: "25%",
  },
  {
    header: "Assigned By",
    accessor: "assignment.assignedByUsername" as keyof Asset,
    width: "25%",
  },
  {
    header: "Returned Date",
    accessor: "returnedDate" as keyof Asset,
    width: "25%",
  },
];
