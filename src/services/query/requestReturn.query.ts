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

export const FIND_REQUEST_RETURN_QUERY = gql`
  query FindRequestReturns(
    $page: Int!
    $stateFilter: [String!]
    $query: String
    $limit: Int
    $sortOrder: String
    $sortField: String
    $returnedDateFilter: String
  ) {
    findRequestReturns(
      request: {
        page: $page
        stateFilter: $stateFilter
        limit: $limit
        query: $query
        sortOrder: $sortOrder
        sortField: $sortField
        returnedDateFilter: $returnedDateFilter
      }
    ) {
      page
      limit
      total
      totalPages
      requestReturns {
        id
        assetId
        assignmentId
        requestedById
        acceptedById
        assignedDate
        returnedDate
        state
        isRemoved
        asset {
          id
          assetCode
          assetName
        }
        acceptedBy {
          id
          username
        }
        requestedBy {
          id
          username
        }
      }
    }
  }
`;

export const COMPLETE_RETURNING = gql`
  mutation CompleteReturning($id: Int!) {
    completeRequestReturn(id: $id) {
      id
      assetId
      assignmentId
      requestedById
      acceptedById
      assignedDate
      returnedDate
      state
      assetId
      isRemoved
    }
  }
`;

export const CANCEL_REQUEST_RETURN = gql`
  mutation CancelRequestReturn($id: Int!) {
    deleteRequestReturn(id: $id) {
      id
      assetId
      assignmentId
      requestedById
      acceptedById
      assignedDate
      returnedDate
      isRemoved
      state
    }
  }
`;
