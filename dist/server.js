"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
// import { seedSuperAdmin } from './utils/seedAdmin';
const prisma_1 = require("./config/prisma");
const seedAdmin_1 = require("./utils/seedAdmin");
let server;
const startServer = async () => {
    try {
        await (0, prisma_1.connectDB)();
        console.log("Connected to DB!!");
        server = app_1.default.listen(env_1.envVars.PORT, () => {
            console.log(`
       🩸 Blood Donation API Server Started
       📍 Port: ${env_1.envVars.PORT}
       🌐 Environment: ${env_1.envVars.NODE_ENV || 'development'}
       🕐 Time: ${new Date().toISOString()}
  `);
        });
    }
    catch (error) {
        console.log(error);
    }
};
(async () => {
    // await connectRedis()
    await startServer();
    await (0, seedAdmin_1.seedSuperAdmin)();
})();
process.on("SIGTERM", () => {
    console.log("SIGTERM signal recieved... Server shutting down..");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("SIGINT", () => {
    console.log("SIGINT signal recieved... Server shutting down..");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejecttion detected... Server shutting down..", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception detected... Server shutting down..", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// Unhandler rejection error
// Promise.reject(new Error("I forgot to catch this promise"))
// Uncaught Exception Error
// throw new Error("I forgot to handle this local erro")
/**
 * unhandled rejection error
 * uncaught rejection error
 * signal termination sigterm
 */
//# sourceMappingURL=server.js.map