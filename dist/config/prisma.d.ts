import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
export declare const prisma: PrismaClient<{
    adapter: PrismaPg;
}, never, import("@prisma/client/runtime/client").DefaultArgs>;
export declare const connectDB: () => Promise<void>;
//# sourceMappingURL=prisma.d.ts.map