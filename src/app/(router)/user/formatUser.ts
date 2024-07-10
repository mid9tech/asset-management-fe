import { formatText } from "@utils/formatText";
import { User } from "../../../__generated__/graphql";
import { formatDate } from "@utils/timeFormat";
import { USER_TYPE } from "../../../types/enum.type";

export const formatUser = (item: User) => {
  return {
    ...item,
    fullName: formatText(`${item.firstName} ${item.lastName}`),
    dateOfBirth: formatDate(parseInt(item.dateOfBirth)),
    joinedDate: formatDate(parseInt(item.joinedDate)),
    type: formatText(item.type === USER_TYPE.STAFF ? "STAFF" : item.type),
    isDisabledIcon: item.type === USER_TYPE.ADMIN ? true : false,
  };
};
