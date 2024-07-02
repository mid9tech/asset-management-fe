import { gql } from "@apollo/client";
import client from "@libs/graphQl/apolloClient";

export const CREATE_ASSIGNMENT_MUTATION = gql`
  mutation CreateAssignment(
    $assetCode: String!
    $assetName: String!
    $assignedToId: Int!
    $assignedToUsername: String!
    $assignedDate: String!
    $note: String!
    $assetId: Int!
  ) {
    createAssignment(
      createAssignmentInput: {
        assetCode: $assetCode
        assetName: $assetName
        assignedToId: $assignedToId
        assignedToUsername: $assignedToUsername
        assignedDate: $assignedDate
        note: $note
        assetId: $assetId
      }
    ) {
      id
      assetCode
      assetName
      state
      note
      assignedDate
      assignee {
        username
      }
      assigner {
        username
      }
    }
  }
`;

export const GET_ALL_ASSIGNMENT_QUERY = gql`
  query FindAssignments(
    $page: Int
    $query: String
    $sortOrder: String
    $sort: String
    $limit: Int
    $assignedDate: String
    $state: [String!]
  ) {
    findAssignments(
      findAssignmentsInput: {
        page: $page
        limit: $limit
        query: $query
        sortOrder: $sortOrder
        state: $state
        sort: $sort
        assignedDate: $assignedDate
      }
    ) {
      page
      limit
      total
      totalPages
      assignments {
        id
        assetCode
        assetName
        state
        note
        assignedDate
        assignedByUsername
        assignedToUsername
        asset {
          specification
        }
        assigner {
          staffCode
          username
        }
        assignee {
          staffCode
          username
        }
      }
    }
  }
`;

export const GET_ALL_OWN_ASSIGNMENT_QUERY = gql`
  query FindOwnAssignments(
    $page: Int
    $query: String
    $sortOrder: String
    $sort: String
    $limit: Int
    $assignedDate: String
    $state: [String!]
  ) {
    getListOwnAssignment(
      findAssignmentsInput: {
        page: $page
        limit: $limit
        query: $query
        sortOrder: $sortOrder
        state: $state
        sort: $sort
        assignedDate: $assignedDate
      }
    ) {
      page
      limit
      total
      totalPages
      assignments {
        id
        assetCode
        assetName
        state
        note
        assignedDate
        assignedByUsername
        assignedToUsername
        asset {
          specification
        }
        assigner {
          staffCode
          username
        }
        assignee {
          staffCode
          username
        }
      }
    }
  }
`;

export const GET_DETAIL_ASSIGNMENT_QUERY = gql`
  query Assignment($id: Int!) {
    assignment(id: $id) {
      id
      assetCode
      assetName
      state
      note
      assignedDate
      asset {
        specification
      }
      assigner {
        id
        firstName
        staffCode
        lastName
        username
        gender
        joinedDate
        dateOfBirth
        type
        state
        location
      }
      assignee {
        id
        firstName
        staffCode
        lastName
        username
        gender
        joinedDate
        dateOfBirth
        type
        state
        location
      }
    }
  }
`;

export const DELETE_ASSIGNMENT = gql`
  mutation DeleteAssignment($id: Int!) {
    removeAssignment(id: $id)
  }
`;


export const UPDATE_STATUS_ASSIGNMENT = gql`
  mutation UpdateStatusAssignment($updateStatusAssignmentInput: UpdateStatusAssignmentInput!) {
    updateStatusAssignment(updateStatusAssignmentInput: $updateStatusAssignmentInput)
  }
`;

export const updateStatusAssignment = async (request: any) => {
  const result = await client.mutate({
    mutation: UPDATE_STATUS_ASSIGNMENT,
    variables: request,
  });
  return {
    data: result.data.updateStatusAssignment,
  };
};

