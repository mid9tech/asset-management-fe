import client from "@libs/graphQl/apolloClient";
import { CreateAssignmentInput, FindAssetsInput } from "../__generated__/graphql";
import { CREATE_ASSIGNMENT_MUTATION, GET_ALL_ASSIGNMENT_QUERY } from "./query/assignment.query";

export const createAssignment = async (value: CreateAssignmentInput) => {
    const result = await client.mutate({
      mutation: CREATE_ASSIGNMENT_MUTATION,
      variables: value,
    });
    return {
      data: result.data.createAssignment,
    };
  };

  export const gettAllAssignment = async (value: FindAssetsInput) => {
    const result = await client.mutate({
      mutation: GET_ALL_ASSIGNMENT_QUERY,
      variables: value,
    });
    return {
      data: result.data.findAssignments,
    }; 
  }