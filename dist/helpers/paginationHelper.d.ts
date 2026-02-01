export type IOptions = {
    page?: string | number;
    limit?: string | number;
    sortBy?: string;
    sortOrder?: string;
};
type IOptionsResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
};
export declare const paginationHelper: {
    calculatePagination: (options: IOptions) => IOptionsResult;
    MOBILE_DEFAULT_LIMIT: number;
    MAX_LIMIT: number;
};
export {};
//# sourceMappingURL=paginationHelper.d.ts.map