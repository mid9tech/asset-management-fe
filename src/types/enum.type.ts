export enum USER_TYPE {
    ALL = 'ALL',
    ADMIN = 'ADMIN',
    STAFF = 'USER',
}

export enum ASSET_TYPE {
    STATE = 'STATE',
    ALL = 'ALL',
    ASSIGNED = 'ASSIGNED',
    AVAILABLE = 'AVAILABLE',
    NOT_AVAILABLE = 'NOT_AVAILABLE',
    WAITING_FOR_RECYCLING = 'WAITING_FOR_RECYCLING',
    RECYCLED = 'RECYCLED'
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