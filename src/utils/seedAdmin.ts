import bcryptjs from "bcryptjs";
import { UserRole } from "@prisma/client";
import { envVars } from "../config/env";
import { prisma } from "../config/prisma";

export const seedSuperAdmin = async () => {
  try {
    const email = envVars.SUPER_ADMIN_EMAIL;

    const isSuperAdminExist = await prisma.user.findUnique({
      where: { email },
    });

    if (isSuperAdminExist) {
      console.log("Super Admin Already Exists!");
      return;
    }

    const hashedPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    // Using nested write to create User and Profile simultaneously
    const superadmin = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN, // Changed from ADMIN to SUPER_ADMIN to match your intent
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
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
};