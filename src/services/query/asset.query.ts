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

export const GET_ALL_ASSET_QUERY = gql`
  query FindAssets(
    $page: Int
    $query: String
    $sortOrder: String
    $sortField: String
    $limit: Int
    $stateFilter: String
    $categoryFilter: Int
  ) {
    findAssets(
      request: {
        page: $page
        query: $query
        sortOrder: $sortOrder
        sortField: $sortField
        limit: $limit
        stateFilter: $stateFilter
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
