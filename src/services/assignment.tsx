import client from "@libs/graphQl/apolloClient";
import {
  CreateAssignmentInput,
  FindAssignmentsInput,
  UpdateAssignmentInput,
  UpdateStatusAssignmentInput,
} from "../__generated__/graphql";
import {
  CREATE_ASSIGNMENT_MUTATION,
  DELETE_ASSIGNMENT,
  EDIT_ASSIGNMENT_MUTATION,
  GET_ALL_ASSIGNMENT_QUERY,
  GET_ALL_OWN_ASSIGNMENT_QUERY,
  GET_DETAIL_ASSIGNMENT_QUERY,
  UPDATE_STATUS_ASSIGNMENT,
} from "./query/assignment.query";

export const createAssignment = async (value: CreateAssignmentInput) => {
  const result = await client.mutate({
    mutation: CREATE_ASSIGNMENT_MUTATION,
    variables: { createAssignmentInput: value },
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

export const getAllOwnAssignment = async (value: FindAssignmentsInput) => {
  const result = await client.query({
    query: GET_ALL_OWN_ASSIGNMENT_QUERY,
    variables: value,
  });
  return {
    data: result.data.getListOwnAssignment,
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

export const updateAssignment = async (
  id: number,
  value: UpdateAssignmentInput
) => {
  try {
    const result = await client.query({
      query: EDIT_ASSIGNMENT_MUTATION,
      variables: { id, updateAssignmentInput: value },
    });
    console.log("updateAssignment", result.data);
    return result.data.updateAssignment;
  } catch (error) {
    console.log("updateAssignment", error);
    return null;
  }
};

export const UpdateStatusAssignmentService = async (
  updateStatusAssignmentInput: UpdateStatusAssignmentInput
) => {
  try {
    const result = await client.mutate({
      mutation: UPDATE_STATUS_ASSIGNMENT,
      variables: { updateStatusAssignmentInput: updateStatusAssignmentInput },
    });
    return result.data.updateStatusAssignment;
  } catch (error) {
    console.log("updateAssignment", error);
    return null;
  }
};
