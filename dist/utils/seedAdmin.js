"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSuperAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const env_1 = require("../config/env");
const prisma_1 = require("../config/prisma");
const seedSuperAdmin = async () => {
    try {
        const email = env_1.envVars.SUPER_ADMIN_EMAIL;
        const isSuperAdminExist = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (isSuperAdminExist) {
            console.log("Super Admin Already Exists!");
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(env_1.envVars.SUPER_ADMIN_PASSWORD, Number(env_1.envVars.BCRYPT_SALT_ROUND));
        // Using nested write to create User and Profile simultaneously
        const superadmin = await prisma_1.prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                role: client_1.UserRole.SUPER_ADMIN, // Changed from ADMIN to SUPER_ADMIN to match your intent
                isVerified: true,
                profile: {
                    create: {
                        firstName: "Super",
                        lastName: "Admin",
                        phone: "01700000000",
                        bloodGroup: "O_POSITIVE",
                        city: "Dhaka",
                        division: "Dhaka",
                        dateOfBirth: new Date("1990-01-01"),
                    },
                },
            },
        });
        console.log("Super Admin Created Successfully!");
        console.log(superadmin);
    }
    catch (error) {
        console.error("Error seeding admin:", error);
    }
};
exports.seedSuperAdmin = seedSuperAdmin;
//# sourceMappingURL=seedAdmin.js.map