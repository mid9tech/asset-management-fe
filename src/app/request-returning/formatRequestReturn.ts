import { formatDate } from "@utils/timeFormat";
import { formatText } from "@utils/formatText";
import { RequestReturn } from "../../__generated__/graphql";
import { REQUEST_RETURN_STATUS } from "../../types/enum.type";

export const formatRequestReturn = (item: RequestReturn) => {
    return {
        ...item,
        assignedDate: formatDate(new Date(item.assignedDate)),
        returnDate: item.returnedDate ? formatDate(new Date(item.returnedDate)) : null,
        state: formatText(item.state),
        isDisabledIcon: item.state === REQUEST_RETURN_STATUS.COMPLETED ? true : false
    }
}