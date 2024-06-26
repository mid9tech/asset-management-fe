import { useQuery } from "@apollo/client";
import { GET_CATEGORY_QUERY } from "@services/query/category.query";

export enum USER_TYPE {
    ADMIN = 'ADMIN',
    STAFF = 'USER',
}

export enum ASSET_TYPE {
    Assigned = 'ASSIGNED',
    Available = 'AVAILABLE',
    Not_available = 'NOT_AVAILABLE',
    Waiting_for_recycling = 'WAITING_FOR_RECYCLING',
    Recycled = 'RECYCLED'
}

export enum SORT_ORDER {
    ASC = 'asc',
    DESC = 'desc',
}

export enum ASSIGNMENT_STATUS {
    WAITING_FOR_ACCEPTANCE = "WAITING_FOR_ACCEPTANCE",
    ACCEPTED = "ACCEPTED",
    DECLINED = "DECLINED",
}