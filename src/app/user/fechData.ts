import clientWithoutAuth from "@libs/graphQl/apolloCilentWithAuth";
import { USER_TYPE } from "../../types/enum.type";
import { findUsers } from "./query";
import client from "@libs/graphQl/apolloClient";

export const loadData = async (
  request = { page: 1}
) => {
  const bookQuery = await client.query({
    query: findUsers,
    variables: request,
  });
  return {
    data: bookQuery.data.findUsers,
  };
};
