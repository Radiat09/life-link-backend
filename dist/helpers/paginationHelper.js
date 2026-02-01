"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationHelper = void 0;
// Mobile-friendly defaults: smaller page size, max limit enforced
const MOBILE_DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const MIN_LIMIT = 1;
const calculatePagination = (options) => {
    let page = Number(options.page) || 1;
    let limit = Number(options.limit) || MOBILE_DEFAULT_LIMIT;
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
    const skip = (Number(page) - 1) * limit;
    const sortBy = options.sortBy || "createdAt";
    const sortOrder = options.sortOrder || "desc";
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    };
};
exports.paginationHelper = {
    calculatePagination,
    MOBILE_DEFAULT_LIMIT,
    MAX_LIMIT
};
//# sourceMappingURL=paginationHelper.js.map