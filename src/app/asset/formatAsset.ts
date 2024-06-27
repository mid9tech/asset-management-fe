import { formatText } from "@utils/formatText"
import { Asset } from "../../__generated__/graphql"
import { formatDate } from "@utils/timeFormat"
import { ASSET_TYPE } from "../../types/enum.type"

export const formatAsset = (item: Asset) => {
    return {
        ...item,
        assetName: formatText(`${item.assetName}`),
        installedDate: formatDate(new Date(item.installedDate)),
         category: formatText(item?.category?.categoryName),
        state: formatText(item.state === ASSET_TYPE.Available ? "AVAILABLE" : item.state),
        isEditDisabled: item.state === 'ASSIGNED'
      }
}

