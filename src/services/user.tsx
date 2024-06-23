import gql from 'graphql-tag';
import axios from 'axios';
import { FindUsersInput } from '../__generated__/graphql';
import { disableUserQuery, fineOneUserQuery, findUsersQuery } from "./query/user.query";
import client from "@libs/graphQl/apolloClient";

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      firstName
      lastName
      gender
      joinedDate
      dateOfBirth
      type
      location
    }
  }
`;

const EDIT_USER_MUTATION = `
  mutation UpdateUser($updateUserInput: UpdateUserInput!, $id: Number) {
    updateUser(updateUserInput: $updateUserInput) {
      id
      firstName
      lastName
      gender
      joinedDate
      dateOfBirth
      type
    }
  }
`;

const DISABLE_USER_MUTATION = `
  mutation DisableUser($id: Number!) {
    disableUser(id: $id)
  }
`;

export const createUser = async (
  firstName: string,
  lastName: string,
  gender: string,
  joinedDate: string,
  dateOfBirth: string,
  type: string,
  location: string
): Promise<any> => {
  const userData = {
    query: CREATE_USER_MUTATION,
    variables: {
      createUserInput: {
        firstName,
        lastName,
        gender,
        joinedDate,
        dateOfBirth,
        type,
        location
      }
    }
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`,
    },
  };
  // const config = {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${process.env.REACT_APP_API_TOKEN}`,
  //   }
  // };

  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_URL_SERVER_GRAPHQL as string,
      userData,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// export const editUser = async (id: number): Promise<any> => {
//   const userData = {
//     query: EDIT_USER_MUTATION,
//     variables: {
//       createUserInput: {
//         id
//         firstName,
//         lastName,
//         gender,
//         joinedDate,
//         dateOfBirth,
//         type
//       }
//     }
//   };

//   const config = {
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${process.env.REACT_APP_API_TOKEN}`, 
//     }
//   };

//   try {
//     const response = await axios.post(process.env.NEXT_PUBLIC_URL_SERVER_GRAPHQL as string, userData, config);
//     return response.data;
//   } catch (error) {
//     console.error("Error creating user:", error);
//     throw error;
//   }
// };


// CALL WITH GRAPHQL
export const loadData = async (request: FindUsersInput) => {
  const result = await client.query({
    query: findUsersQuery,
    variables: request,
  });
  return {
    data: result.data.findUsers,
  };
};

export const loadDetail = async(id: number) => {
  const result = await client.query({
    query: fineOneUserQuery,
    variables: {id}
  });
  return {
    data: result.data.user
  }
}

export const disableUser = async(id: number) => {
  const result = await client.mutate({
    mutation: disableUserQuery,
    variables: {id}
  });
  return {
    data: result.data.disableUser
  }
}
