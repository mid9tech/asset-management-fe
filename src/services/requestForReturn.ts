import client from "@libs/graphQl/apolloClient";
import { FindRequestReturnsInput } from "../__generated__/graphql";
import {
  CANCEL_REQUEST_RETURN,
  COMPLETE_RETURNING,
  FIND_REQUEST_RETURN_QUERY,
} from "./query/requestReturn.query";

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

export const CompleteReturningService = async (id: number) => {
  const result = await client.query({
    query: COMPLETE_RETURNING,
    variables: { id },
  });
  return {
    data: result.data.completeRequestReturn,
  };
};

export const CancelRequestReturnService = async (id: number) => {
  const result = await client.query({
    query: CANCEL_REQUEST_RETURN,
    variables: { id },
  });
  return {
    data: result.data.deleteRequestReturn,
  };
};
