import { findUsers } from "./query";
import client from "@libs/graphQl/apolloClient";
import { FindUsersInput } from "../../__generated__/graphql";

export const loadData = async (request: FindUsersInput) => {
  const bookQuery = await client.query({
    query: findUsers,
    variables: request,
  });
  return {
    data: bookQuery.data.findUsers,
  };
};
