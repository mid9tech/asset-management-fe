import client from "@libs/graphQl/apolloClient";
import { CreateAssignmentInput } from "../__generated__/graphql";
import { CREATE_ASSIGNMENT_MUTATION } from "./query/assignment.query";

export const createAssignment = async (value: CreateAssignmentInput) => {
    const result = await client.mutate({
      mutation: CREATE_ASSIGNMENT_MUTATION,
      variables: value,
    });
    return {
      data: result.data.createAssignment,
    };
  };