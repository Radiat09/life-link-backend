"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const env_1 = require("./config/env");
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./middlewares/notFound"));
const app = (0, express_1.default)();
// app.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   PaymentController.handleStripeWebhookEvent
// );
// Body parsers FIRST
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Then other middleware
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.envVars.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
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
app.use('/api/v1', routes_1.default);
app.get('/', (req, res) => {
    res.send({
        message: '🩸 Blood Donation API Server Started',
        port: `📍${env_1.envVars.PORT || 5000}`,
        environment: env_1.envVars.NODE_ENV,
        uptime: process.uptime().toFixed(2) + ' sec',
        timeStamp: new Date().toISOString(),
    });
});
app.use(globalErrorHandler_1.default);
app.use(notFound_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map