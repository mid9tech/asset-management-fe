import { gql } from "@apollo/client";

export const CREATE_ASSIGNMENT_MUTATION = gql`
  mutation CreateAssignment(
    $assetCode: String!
    $assetName: String!
    $assignedToId: Int!
    $assignedToUsername: String!
    $assignedById: Int!
    $state: String!
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
        assignedById: $assignedById
        state: $state
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
  query FindAssignments($findAssignmentsInput: FindAssignmentsInput!) {
    findAssignments(findAssignmentsInput: $findAssignmentsInput) {
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
  }
`;
