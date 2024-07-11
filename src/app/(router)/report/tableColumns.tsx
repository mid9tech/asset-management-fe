import { ReportElement } from "../../../__generated__/graphql";

export const userColumns = [
    {
      header: "Category",
      accessor: "category_name" as keyof ReportElement,
      width: "24%",
      sortField: "category_name"
    },
    {
      header: "Total",
      accessor: "total" as keyof ReportElement,
      width: "10%",
      sortField: "total"
    },
    {
      header: "Assigned",
      accessor: "assigned" as keyof ReportElement,
      width: "10%",
      sortField: "assigned"
    },
    {
      header: "Available",
      accessor: "available" as keyof ReportElement,
      width: "10%",
      sortField: "available"
    },
    {
      header: "Not available",
      accessor: "not_available" as keyof ReportElement,
      width: "14%",
      sortField: "not_available"
    },
    {
      header: "Waiting for recycling",
      accessor: "waiting_for_recycling" as keyof ReportElement,
      width: "16%",
      sortField: "waiting_for_recycling"
    },
    {
      header: "Recycled",
      accessor: "recycled" as keyof ReportElement,
      width: "10%",
      sortField: "recycled"
    },
  ];