import { SORT_ORDER } from "../types/enum.type";

export const checkSortOrder = (sortBy: string, fieldInput: string, currentSortOrder: string) => {
    let defaultOrder = SORT_ORDER.ASC;
    if (sortBy === fieldInput) {
      defaultOrder =
      currentSortOrder === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC;
    }
    return defaultOrder;
}