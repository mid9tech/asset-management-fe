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
`
