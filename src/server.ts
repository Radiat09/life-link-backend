import app from './app';
import { envVars } from './config/env';
import { Server } from 'http';
// import { seedSuperAdmin } from './utils/seedAdmin';
import { connectDB } from './config/prisma';

let server: Server;


const startServer = async () => {
  try {
    await connectDB()

    console.log("Connected to DB!!");

    server = app.listen(envVars.PORT, () => {
      console.log(`
       🩸 Blood Donation API Server Started
       📍 Port: ${envVars.PORT}
       🌐 Environment: ${envVars.NODE_ENV || 'development'}
       🕐 Time: ${new Date().toISOString()}
  `);
    });
  } catch (error) {
    console.log(error);
  }
}

(async () => {
  // await connectRedis()
  await startServer()
  // await seedSuperAdmin()
})()

process.on("SIGTERM", () => {
  console.log("SIGTERM signal recieved... Server shutting down..");

  if (server) {
    server.close(() => {
      process.exit(1)
    });
  }

  process.exit(1)
})

process.on("SIGINT", () => {
  console.log("SIGINT signal recieved... Server shutting down..");

  if (server) {
    server.close(() => {
      process.exit(1)
    });
  }

  process.exit(1)
})


process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejecttion detected... Server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1)
    });
  }

  process.exit(1)
})

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception detected... Server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1)
    });
  }

  process.exit(1)
})

// Unhandler rejection error
// Promise.reject(new Error("I forgot to catch this promise"))

// Uncaught Exception Error
// throw new Error("I forgot to handle this local erro")


/**
 * unhandled rejection error
 * uncaught rejection error
 * signal termination sigterm
 */

