import { gql } from "@apollo/client";

export const CREATE_ASSET_MUTATION = gql`
  mutation CreateAsset($createAssetInput: CreateAssetInput!) {
    createAsset(createAssetInput: $createAssetInput) {
      id
      assetCode
      assetName
      categoryId
      installedDate
      state
      location
      specification
      category {
        id
        categoryName
        categoryCode
      }
    }
  }
`;

export const EDIT_ASSET_MUTATION = gql`
  mutation UpdateAsset($id: Int!, $updateAssetInput: UpdateAssetInput!) {
    updateAsset(id: $id, updateAssetInput: $updateAssetInput) {
      id
      assetCode
      assetName
      categoryId
      installedDate
      state
      location
      specification
    }
  }
`;

export const FIND_ONE_ASSET_QUERY = gql`
  query FindOneAsset($id: Int!) {
    findOneAsset(id: $id) {
      id
      assetCode
      assetName
      categoryId
      installedDate
      state
      location
      specification
      category {
        id
        categoryName
        categoryCode
      }
    }
  }
`;

export const FIND_ASSETS_QUERY = gql`
  query FindAssets(
    $page: Int
    $query: String
    $sortOrder: String
    $stateFilter: [String!]
    $sortField: String
    $categoryFilter: [String!]
  ) {
    findAssets(
      request: {
        page: $page
        query: $query
        sortOrder: $sortOrder
        stateFilter: $stateFilter
        sortField: $sortField
        categoryFilter: $categoryFilter
      }
    ) {
      page
      limit
      total
      totalPages
      assets {
        id
        assetCode
        assetName
        categoryId
        installedDate
        state
        location
        specification
        category {
          id
          categoryName
          categoryCode
        }
      }
    }
  }
`;
