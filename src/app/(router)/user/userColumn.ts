import { User } from "../../../__generated__/graphql";

export const userColumns = [
  {
    header: "Staff Code",
    accessor: "staffCode" as keyof User,
    width: "10%",
    sortField: "staffCode",
  },
  {
    header: "Full Name",
    accessor: "fullName" as keyof User,
    width: "30%",
    sortField: "firstName",
  },
  {
    header: "Username",
    accessor: "username" as keyof User,
    width: "20%",
  },
  {
    header: "Joined Date",
    accessor: "joinedDate" as keyof User,
    width: "15%",
    sortField: "joinedDate",
  },
  {
    header: "Type",
    accessor: "type" as keyof User,
    width: "10%",
    sortField: "type",
  },
  { header: "icon", accessor: "" as keyof User, width: "9%" },
];
