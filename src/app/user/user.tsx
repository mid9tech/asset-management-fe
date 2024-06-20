import { Fragment, Suspense } from "react";
import { USER_TYPE } from "../../types/enum.type";
import { loadData } from "./fechData";

interface Props {
  limit: string;
  page: number;
  query: string;
  sortOrder: string;
  type: USER_TYPE;
  sort: string;
}
export default async function Users({ page }: Props) {
  const { data } = await loadData({ page: page });
  return data;
}
