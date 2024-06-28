import { gql } from "@apollo/client";

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
      assetId
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
    $state: String
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
        assetId
        assignedByUsername
        assignedToUsername
        assigner {
          id
          staffCode
          username
          type
          location
        }
        assignee {
          id
          staffCode
          username
          type
          location
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
        assetId
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
}`

