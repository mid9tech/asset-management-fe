import { gql } from "@apollo/client";

export const fineOneUserQuery = gql`
    query User($id: Int!) {
    user(id: $id) {
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
`;

export const findUsersQuery = gql`
  query FindUsers(
    $page: Int
    $query: String
    $sortOrder: String
    $type: String
    $sort: String
  ) {
    findUsers(
      request: {
        page: $page
        query: $query
        sortOrder: $sortOrder
        type: $type
        sort: $sort
      }
    ) {
      page
      limit
      total
      totalPages
      users {
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

export const disableUserQuery = gql`
  mutation DisableUser($id: Int!) {
    disableUser(id: $id)
  }
`;
