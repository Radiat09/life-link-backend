"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.prisma = void 0;
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
// 1. Create a pg Pool
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
// 2. Initialize the Prisma Driver Adapter
const adapter = new adapter_pg_1.PrismaPg(pool);
// 3. Pass the adapter to the PrismaClient constructor
exports.prisma = new client_1.PrismaClient({ adapter });
const connectDB = async () => {
    try {
        await exports.prisma.$connect();
        console.log('Database connected successfully');
    }
    catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=prisma.js.map