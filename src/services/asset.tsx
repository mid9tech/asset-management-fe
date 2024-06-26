import client from "@libs/graphQl/apolloClient";
import { GET_ALL_ASSET_QUERY } from "./query/asset.query";
import { FindAssetsInput } from "../__generated__/graphql";

export const loadListAsset = async (data: FindAssetsInput) => {
  const result = await client.query({
    query: GET_ALL_ASSET_QUERY,
    variables: data,
  });
  return {
    data: result.data.findAssets,
  };
};
