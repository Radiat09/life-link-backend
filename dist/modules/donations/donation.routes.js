"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.donationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const donation_controller_1 = require("./donation.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const donation_validation_1 = require("./donation.validation");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// Public routes
router.get('/statistics', donation_controller_1.DonationController.getDonationStats);
// Protected routes
router.post('/', (0, checkAuth_1.checkAuth)(client_1.UserRole.USER, client_1.UserRole.HOSPITAL, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(donation_validation_1.createDonationZodSchema), donation_controller_1.DonationController.createDonation);
router.get('/my-donations', (0, checkAuth_1.checkAuth)(client_1.UserRole.USER, client_1.UserRole.HOSPITAL, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), donation_controller_1.DonationController.getMyDonations);
router.get('/', (0, checkAuth_1.checkAuth)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), donation_controller_1.DonationController.getAllDonations);
router.get('/:id', (0, checkAuth_1.checkAuth)(client_1.UserRole.USER, client_1.UserRole.HOSPITAL, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), donation_controller_1.DonationController.getDonationById);
router.patch('/:id', (0, checkAuth_1.checkAuth)(client_1.UserRole.USER, client_1.UserRole.HOSPITAL, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(donation_validation_1.updateDonationZodSchema), donation_controller_1.DonationController.updateDonation);
router.patch('/:id/cancel', (0, checkAuth_1.checkAuth)(client_1.UserRole.USER, client_1.UserRole.HOSPITAL, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), donation_controller_1.DonationController.cancelDonation);
exports.donationRoutes = router;
//# sourceMappingURL=donation.routes.js.map