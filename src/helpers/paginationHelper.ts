export type IOptions = {
    page?: string | number;
    limit?: string | number;
    sortBy?: string;
    sortOrder?: string;
}

type IOptionsResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
}

// Mobile-friendly defaults: smaller page size, max limit enforced
const MOBILE_DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const MIN_LIMIT = 1;

const calculatePagination = (options: IOptions): IOptionsResult => {
    let page: number = Number(options.page) || 1;
    let limit: number = Number(options.limit) || MOBILE_DEFAULT_LIMIT;

    // Enforce limits for performance and mobile optimization
    if (limit > MAX_LIMIT) {
        limit = MAX_LIMIT;
    }
    if (limit < MIN_LIMIT) {
        limit = MIN_LIMIT;
    }
    if (page < 1) {
        page = 1;
    }

    const skip: number = (Number(page) - 1) * limit;

    const sortBy: string = options.sortBy || "createdAt";
    const sortOrder: string = options.sortOrder || "desc";

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    }
}

export const paginationHelper = {
    calculatePagination,
    MOBILE_DEFAULT_LIMIT,
    MAX_LIMIT
}