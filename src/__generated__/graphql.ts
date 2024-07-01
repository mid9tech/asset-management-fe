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
  assetCode: Scalars['String']['output'];
  assetName: Scalars['String']['output'];
  category: Category;
  categoryId: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  installedDate: Scalars['String']['output'];
  location: Scalars['String']['output'];
  specification?: Maybe<Scalars['String']['output']>;
  state: Scalars['String']['output'];
};

export type Assignment = {
  __typename?: 'Assignment';
  asset: Asset;
  assetCode: Scalars['String']['output'];
  assetName: Scalars['String']['output'];
  assignedByUsername?: Maybe<Scalars['String']['output']>;
  assignedDate: Scalars['String']['output'];
  assignedToUsername?: Maybe<Scalars['String']['output']>;
  assignee: User;
  assigner: User;
  id: Scalars['Int']['output'];
  note?: Maybe<Scalars['String']['output']>;
  state: Scalars['String']['output'];
};

export type Category = {
  __typename?: 'Category';
  categoryCode: Scalars['String']['output'];
  categoryName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type CreateAssetInput = {
  /** Name of the asset */
  assetName: Scalars['String']['input'];
  /** ID of the category */
  categoryId: Scalars['Int']['input'];
  /** Date the asset was installed */
  installedDate: Scalars['String']['input'];
  /** Specification of the asset */
  specification?: InputMaybe<Scalars['String']['input']>;
  /** State of the asset */
  state: Scalars['String']['input'];
};

export type CreateAssignmentInput = {
  assetCode: Scalars['String']['input'];
  assetId: Scalars['Int']['input'];
  assetName: Scalars['String']['input'];
  assignedDate: Scalars['String']['input'];
  assignedToId: Scalars['Int']['input'];
  assignedToUsername: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCategoryInput = {
  categoryCode: Scalars['String']['input'];
  categoryName: Scalars['String']['input'];
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

export type FindAssetsInput = {
  categoryFilter?: InputMaybe<Array<Scalars['String']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  sortField?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
  stateFilter?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type FindAssetsOutput = {
  __typename?: 'FindAssetsOutput';
  assets: Array<Asset>;
  limit?: Maybe<Scalars['Int']['output']>;
  page?: Maybe<Scalars['Int']['output']>;
  total?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type FindAssignmentsInput = {
  assignedDate?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type FindAssignmentsOutput = {
  __typename?: 'FindAssignmentsOutput';
  assignments: Array<Assignment>;
  limit?: Maybe<Scalars['Int']['output']>;
  page?: Maybe<Scalars['Int']['output']>;
  total?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type FindUsersInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Array<Scalars['String']['input']>>;
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
  createCategory: Category;
  createRequestReturn: RequestReturn;
  createUser: User;
  disableUser: Scalars['Boolean']['output'];
  removeRequestReturn: RequestReturn;
  updateAsset: Asset;
  updateRequestReturn: RequestReturn;
  updateUser: User;
};


export type MutationCreateAssetArgs = {
  createAssetInput: CreateAssetInput;
};


export type MutationCreateAssignmentArgs = {
  createAssignmentInput: CreateAssignmentInput;
};


export type MutationCreateCategoryArgs = {
  createCategoryInput: CreateCategoryInput;
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


export type MutationRemoveRequestReturnArgs = {
  id: Scalars['Int']['input'];
};


export type MutationUpdateAssetArgs = {
  id: Scalars['Int']['input'];
  updateAssetInput: UpdateAssetInput;
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
  assignment: Assignment;
  findAssets: FindAssetsOutput;
  findAssignments: FindAssignmentsOutput;
  findOneAsset: Asset;
  findUsers: FindUsersOutput;
  getCategories: Array<Category>;
  requestReturn: RequestReturn;
  requestReturns: Array<RequestReturn>;
  user: User;
};


export type QueryAssignmentArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFindAssetsArgs = {
  request: FindAssetsInput;
};


export type QueryFindAssignmentsArgs = {
  findAssignmentsInput: FindAssignmentsInput;
};


export type QueryFindOneAssetArgs = {
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
  /** Name of the asset */
  assetName: Scalars['String']['input'];
  /** Date the asset was installed */
  installedDate: Scalars['String']['input'];
  /** Specification of the asset */
  specification?: InputMaybe<Scalars['String']['input']>;
  /** State of the asset */
  state: Scalars['String']['input'];
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


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: string, firstName: string, lastName: string, gender: string, joinedDate: string, dateOfBirth: string, type: string, location: string } };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['Float']['input'];
  updateUserInput: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: string, firstName: string, lastName: string, gender: string, joinedDate: string, dateOfBirth: string, type: string, location: string } };

export type GetUserByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetUserByIdQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, firstName: string, lastName: string, gender: string, joinedDate: string, dateOfBirth: string, type: string, location: string, staffCode: string, username: string } };


export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createUserInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createUserInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createUserInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"joinedDate"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateUserInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"updateUserInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateUserInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"joinedDate"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const GetUserByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"joinedDate"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"staffCode"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<GetUserByIdQuery, GetUserByIdQueryVariables>;