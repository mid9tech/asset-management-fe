import { formatStateText, formatText } from "@utils/formatText";
import { Assignment, User } from "../../__generated__/graphql";
import { formatDate } from "@utils/timeFormat";
import { ASSIGNMENT_STATUS } from "../../types/enum.type";

export const formatAssignment = (item: Assignment) => {
  return {
    ...item,
    state: formatStateText(item.state),
    assignedDate: formatDate(item.assignedDate),
    isDisabledIcon: item.state === ASSIGNMENT_STATUS.ACCEPTED ? true : false
  };
};
