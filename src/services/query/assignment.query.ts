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
