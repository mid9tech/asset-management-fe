import { Asset } from "../../__generated__/graphql";

export const assetColumns = [
    { header: "Asset Code", accessor: "assetCode" as keyof Asset, width: "15%" },
    { header: "Asset Name", accessor: "assetName" as keyof Asset, width: "40%" },
    { header: "Category", accessor: "category" as keyof Asset, width: "20%" },
    { header: "State", accessor: "state" as keyof Asset, width: "15%" },
    { header: "icon", accessor: "" as keyof Asset },
  ];
  
export  const historyColumns = [
    { header: "Date", accessor: "date" as keyof Asset },
    { header: "Assigned To", accessor: "assignedTo" as keyof Asset },
    { header: "Assigned By", accessor: "assignedBy" as keyof Asset },
    { header: "Returned Date", accessor: "returnedDate" as keyof Asset },
  ];
  