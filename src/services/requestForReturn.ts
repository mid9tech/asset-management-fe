import client from "@libs/graphQl/apolloClient";
import { FindRequestReturnsInput } from "../__generated__/graphql";
import { toast } from "react-toastify";
import { FIND_REQUEST_RETURN_QUERY } from "./query/requestReturn.query";

export const loadDataRequest = async (request: FindRequestReturnsInput) => {
  try {
    const result = await client.query({
      query: FIND_REQUEST_RETURN_QUERY,
      variables: request,
    });
    return {
      data: result.data.findRequestReturns,
    };
  } catch (error: any) {
    throw new Error(error);
  }
};
