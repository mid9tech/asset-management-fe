import { ReportElement } from "../../__generated__/graphql";

export const userColumns = [
    {
      header: "Category",
      accessor: "category_name" as keyof ReportElement,
      width: "20%",
    },
    {
      header: "Total",
      accessor: "total" as keyof ReportElement,
      width: "10%",
    },
    {
      header: "Assigned",
      accessor: "assigned" as keyof ReportElement,
      width: "10%",
    },
    {
      header: "Available",
      accessor: "available" as keyof ReportElement,
      width: "10%",
    },
    {
      header: "Not available",
      accessor: "not_available" as keyof ReportElement,
      width: "14%",
    },
    {
      header: "Waiting for recycling",
      accessor: "waiting_for_recycling" as keyof ReportElement,
      width: "16%",
    },
    {
      header: "Recycled",
      accessor: "recycled" as keyof ReportElement,
      width: "10%",
    },
  ];