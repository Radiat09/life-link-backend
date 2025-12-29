import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import router from './routes';
import { envVars } from './config/env';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFound from './middlewares/notFound';



const app: Application = express();

// app.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   PaymentController.handleStripeWebhookEvent
// );

// Body parsers FIRST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Then other middleware
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

// cron.schedule("* * * * *", async () => {
//   try {
//     console.log("Node cron called at", new Date());
//     AppointmentService.cancelUnpaidAppointments();
//   } catch (error) {
//     console.error(error);
//     throw new AppError(500, "Failed to cancel unpaid appointments");
//   }
// })

// Routes last
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send({
    message: '🩸 Blood Donation API Server Started',
   port:`📍${envVars.PORT ||5000}`,
    environment: envVars.NODE_ENV,
    uptime: process.uptime().toFixed(2) + ' sec',
    timeStamp: new Date().toISOString(),
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
