/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Asset = {
  __typename?: 'Asset';
  /** Example field (placeholder) */
  exampleField: Scalars['Int']['output'];
};

export type Assignment = {
  __typename?: 'Assignment';
  /** Example field (placeholder) */
  exampleField: Scalars['Int']['output'];
};

export type CreateAssetInput = {
  /** Example field (placeholder) */
  exampleField: Scalars['Int']['input'];
};

export type CreateAssignmentInput = {
  /** Example field (placeholder) */
  exampleField: Scalars['Int']['input'];
};

export type CreateRequestReturnInput = {
  /** Example field (placeholder) */
  exampleField: Scalars['Int']['input'];
};

export type CreateUserInput = {
  dateOfBirth: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  gender: Scalars['String']['input'];
  joinedDate: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  location?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
};

export type FindUsersInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type FindUsersOutput = {
  __typename?: 'FindUsersOutput';
  limit?: Maybe<Scalars['Int']['output']>;
  page?: Maybe<Scalars['Int']['output']>;
  total?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
  users: Array<User>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createAsset: Asset;
  createAssignment: Assignment;
  createRequestReturn: RequestReturn;
  createUser: User;
  disableUser: Scalars['Boolean']['output'];
  removeAsset: Asset;
  removeAssignment: Assignment;
  removeRequestReturn: RequestReturn;
  removeUser: User;
  updateAsset: Asset;
  updateAssignment: Assignment;
  updateRequestReturn: RequestReturn;
  updateUser: User;
};


export type MutationCreateAssetArgs = {
  createAssetInput: CreateAssetInput;
};


export type MutationCreateAssignmentArgs = {
  createAssignmentInput: CreateAssignmentInput;
};


export type MutationCreateRequestReturnArgs = {
  createRequestReturnInput: CreateRequestReturnInput;
};


export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};


export type MutationDisableUserArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveAssetArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveAssignmentArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveRequestReturnArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveUserArgs = {
  id: Scalars['Int']['input'];
};


export type MutationUpdateAssetArgs = {
  updateAssetInput: UpdateAssetInput;
};


export type MutationUpdateAssignmentArgs = {
  updateAssignmentInput: UpdateAssignmentInput;
};


export type MutationUpdateRequestReturnArgs = {
  updateRequestReturnInput: UpdateRequestReturnInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['Float']['input'];
  updateUserInput: UpdateUserInput;
};

export type Query = {
  __typename?: 'Query';
  asset: Asset;
  assets: Array<Asset>;
  assignment: Assignment;
  assignments: Array<Assignment>;
  findUsers: FindUsersOutput;
  requestReturn: RequestReturn;
  requestReturns: Array<RequestReturn>;
  user: User;
};


export type QueryAssetArgs = {
  id: Scalars['Int']['input'];
};


export type QueryAssignmentArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFindUsersArgs = {
  request: FindUsersInput;
};


export type QueryRequestReturnArgs = {
  id: Scalars['Int']['input'];
};


export type QueryUserArgs = {
  id: Scalars['Int']['input'];
};

export type RequestReturn = {
  __typename?: 'RequestReturn';
  /** Example field (placeholder) */
  exampleField: Scalars['Int']['output'];
};

export type UpdateAssetInput = {
  /** Example field (placeholder) */
  exampleField?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['Int']['input'];
};

export type UpdateAssignmentInput = {
  /** Example field (placeholder) */
  exampleField?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['Int']['input'];
};

export type UpdateRequestReturnInput = {
  /** Example field (placeholder) */
  exampleField?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['Int']['input'];
};

export type UpdateUserInput = {
  dateOfBirth?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  joinedDate?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  dateOfBirth: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  gender: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  joinedDate: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  location: Scalars['String']['output'];
  staffCode: Scalars['String']['output'];
  state: Scalars['Boolean']['output'];
  type: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type CreateUserMutationVariables = Exact<{
  createUserInput: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', firstName: string, lastName: string, gender: string, joinedDate: string, dateOfBirth: string, type: string, location: string } };


export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createUserInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createUserInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createUserInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"joinedDate"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;