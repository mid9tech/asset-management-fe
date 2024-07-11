import { FindAssetsInput } from "../__generated__/graphql";
import { FIND_ASSETS_QUERY, FIND_ONE_ASSET_QUERY } from "./query/asset.query";
import client from "@libs/graphQl/apolloClient";


export const loadDataAsset = async (request: FindAssetsInput) => {
  const result = await client.query({
    query: FIND_ASSETS_QUERY,
    variables: request,
  });
  return {
    data: result.data.findAssets,
  };
};

export const loadDetailAsset = async (id: number) => {
  try {
    const result = await client.query({
      query: FIND_ONE_ASSET_QUERY,
      variables: { id },
    });
    console.log("result.data",result.data);
    return result.data.findOneAsset
  }
  catch (error) {
    console.log(error)
    return null
  }
};