import { formatStateText } from "@utils/formatText";
import { Assignment } from "../../__generated__/graphql";
import { formatDate } from "@utils/timeFormat";
import { ASSIGNMENT_STATUS } from "../../types/enum.type";

export const formatAssignment = (item: Assignment) => {
  return {
    ...item,
    state: formatStateText(item.state),
    assignedDate: formatDate(new Date(item.assignedDate)),
    isDisabledIcon: (item.state === ASSIGNMENT_STATUS.ACCEPTED || item.state === ASSIGNMENT_STATUS.DECLINED) ? true : false
  };
};
