import { useQuery } from "@apollo/client";
import { GET_CATEGORY_QUERY } from "@services/query/category.query";

export enum USER_TYPE {
    ALL = 'ALL',
    ADMIN = 'ADMIN',
    STAFF = 'USER',
}

export enum ASSET_TYPE {
    State = 'STATE',
    All = 'ALL',
    Assigned = 'ASSIGNED',
    Available = 'AVAILABLE',
    Not_available = 'NOT_AVAILABLE',
    Waiting_for_recycling = 'WAITING_FOR_RECYCLING',
    Recycled = 'RECYCLED'
}


export const CATEGORY_TYPE = () => {
    const { data, loading, error } = useQuery(GET_CATEGORY_QUERY);

    if (loading) return { loading, categories: [] };
    if (error) return { error, categories: [] };

    const categories = [{ id: 'ALL', categoryName: 'ALL' }, ...data.getCategories];

    return {
        categories: categories.reduce((acc: { [key: string]: any }, category: any) => {
            acc[category.id] = category.categoryName;
            return acc;
        }, {}),
    };
};

export enum SORT_ORDER {
    ASC = 'asc',
    DESC = 'desc',
}

export enum ASSIGNMENT_STATUS {
    WAITING_FOR_ACCEPTANCE = "WAITING_FOR_ACCEPTANCE",
    ACCEPTED = "ACCEPTED",
    DECLINED = "DECLINED",
}