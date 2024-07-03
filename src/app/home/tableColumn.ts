import { Assignment } from "../../__generated__/graphql";

export const tableColumns = [
    { header: "No.", accessor: "id" as keyof Assignment, width: "5%" },
    {
      header: "Asset Code",
      accessor: "assetCode" as keyof Assignment,
      width: "13%",
    },
    {
      header: "Asset Name",
      accessor: "assetName" as keyof Assignment,
      width: "15%",
    },
    {
      header: "Assigned To",
      accessor: "assignedToUsername" as keyof Assignment,
      width: "12%",
    },
    {
      header: "Assigned By",
      accessor: "assignedByUsername" as keyof Assignment,
      width: "12%",
    },
    {
      header: "Assigned Date",
      accessor: "assignedDate" as keyof Assignment,
      width: "13%",
    },
    { header: "State", accessor: "state" as keyof Assignment, width: "15%" },
    { header: "icon", accessor: "" as keyof Assignment, width: "10%" },
  ];