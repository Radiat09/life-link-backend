
import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import { prisma } from "../config/prisma";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await prisma.user.findUnique({
      where: {
        email: envVars.SUPER_ADMIN_EMAIL,
      },
    });

    if (isSuperAdminExist) {
      console.log("Super Admin Already Exists!");
      return;
    }

    console.log("Trying to create Super Admin...");

    const hashedPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const payload = {
      name: "Ridoy",
      role: UserRole.ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
    } as Prisma.UserCreateInput;

    const superadmin = await prisma.user.create({ data: payload });
    console.log("Super Admin Created Successfuly! \n");
    console.log(superadmin);
  } catch (error) {
    console.log(error);
  }
};
