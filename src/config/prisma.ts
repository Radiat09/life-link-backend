import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// 1. Create a pg Pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Initialize the Prisma Driver Adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter to the PrismaClient constructor
export const prisma = new PrismaClient({ adapter });



export const connectDB = async () => {
  try {
    await prisma.$connect()
    console.log('Database connected successfully')
  } catch (error) {
    console.error('Database connection error:', error)
    process.exit(1)
  }
}
