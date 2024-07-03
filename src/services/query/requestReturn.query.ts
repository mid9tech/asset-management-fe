import { gql } from "@apollo/client";

export const CREATE_REQUEST_RETURN = gql`
mutation CreateRequestReturn($request: CreateRequestReturnInput!) {
    createRequestReturn(request: $request) {
      id
      assetId
      assignmentId
      requestedById
      acceptedById
      assignedDate
      returnedDate
      state
      isRemoved
    }
  }
`;