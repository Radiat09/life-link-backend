interface IOptions {
    page?: string | number;
    limit?: string | number;
    sortBy?: string;
    sortOrder?: string;
}
interface PaginatedResponse {
    data: any[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
export declare const BloodInventoryService: {
    createBloodInventory: (hospitalId: string | null, data: any) => Promise<any>;
    getBloodInventory: (filters: any, options: IOptions) => Promise<PaginatedResponse>;
    getBloodInventoryById: (id: string) => Promise<any>;
    updateBloodInventory: (id: string, data: any) => Promise<any>;
    adjustBloodUnits: (id: string, quantity: number, type: "add" | "deduct") => Promise<any>;
    getLowStockInventory: () => Promise<any[]>;
    getInventoryStats: () => Promise<any>;
};
export {};
//# sourceMappingURL=bloodInventory.service.d.ts.map