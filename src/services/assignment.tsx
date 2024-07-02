import client from "@libs/graphQl/apolloClient";
import {
  CreateAssignmentInput,
  FindAssignmentsInput,
} from "../__generated__/graphql";
import {
  CREATE_ASSIGNMENT_MUTATION,
  DELETE_ASSIGNMENT,
  GET_ALL_ASSIGNMENT_QUERY,
  GET_DETAIL_ASSIGNMENT_QUERY,
} from "./query/assignment.query";

export const createAssignment = async (value: CreateAssignmentInput) => {
  const result = await client.mutate({
    mutation: CREATE_ASSIGNMENT_MUTATION,
    variables: value,
  });
  return {
    data: result.data.createAssignment,
  };
};

export const gettAllAssignment = async (value: FindAssignmentsInput) => {
  const result = await client.query({
    query: GET_ALL_ASSIGNMENT_QUERY,
    variables: value,
  });
  return {
    data: result.data.findAssignments,
  };
};
export const loadDetailAssignment = async (id: number) => {
  try {
    const result = await client.query({
      query: GET_DETAIL_ASSIGNMENT_QUERY,
      variables: { id },
    });
    console.log("result.data", result.data);
    return result.data.assignment;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteAssignment = async (id: number) => {
  try {
    const result = await client.mutate({
      mutation: DELETE_ASSIGNMENT,
      variables: { id },
    });
    return result.data.removeAssignment;
  } catch (error) {
    console.log(error);
    return null;
  }
};
