"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../../config/env");
const emailSender = async (email, html) => {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: env_1.envVars.EMAIL_SENDER.SMTP_USER,
            pass: env_1.envVars.EMAIL_SENDER.SMTP_PASS, // app password
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    const info = await transporter.sendMail({
        from: `"PH Health Care" <${env_1.envVars.EMAIL_SENDER.SMTP_FROM}>`, // sender address
        to: email, // list of receivers
        subject: "Reset Password Link", // Subject line
        //text: "Hello world?", // plain text body
        html, // html body
    });
};
exports.default = emailSender;
//# sourceMappingURL=emailSender.js.map