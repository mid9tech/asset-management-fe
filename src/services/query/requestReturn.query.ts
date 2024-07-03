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
