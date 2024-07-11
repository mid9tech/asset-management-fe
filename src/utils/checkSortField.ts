import { SORT_ORDER } from "../types/enum.type";

export const checkSortOrder = (currentSortOrder: string) => {
  return currentSortOrder === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC;
};
