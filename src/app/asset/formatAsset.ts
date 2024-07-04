import { formatText } from "@utils/formatText";
import { Asset, RequestReturn } from "../../__generated__/graphql";
import { formatDate } from "@utils/timeFormat";
import { ASSET_TYPE } from "../../types/enum.type";

const formatHistory = (item: RequestReturn) => {
  console.log('item', item);
  return {
    ...item,
    returnedDate: item.returnedDate ? formatDate(parseInt(item.returnedDate as string)) : null,
    assignedDate: formatDate(parseInt(item.assignedDate)),
  };
};

export const formatAsset = (item: Asset) => {
  return {
    ...item,
    assetName: formatText(`${item.assetName}`),
    installedDate: formatDate(new Date(item.installedDate)),
    category: formatText(item?.category?.categoryName),
    state: formatText(
      item.state === ASSET_TYPE.Available ? "AVAILABLE" : item.state
    ),
    history: item?.history.map(item => formatHistory(item)),
    isDisabledIcon: item.state === ASSET_TYPE.Assigned ? true : false,
  };
};


