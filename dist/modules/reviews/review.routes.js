"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const review_controller_1 = require("./review.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const review_validation_1 = require("./review.validation");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// Public routes
router.get('/statistics', review_controller_1.ReviewController.getReviewStats);
router.get('/donor/:donorId', review_controller_1.ReviewController.getDonorReviews);
// Protected routes
router.post('/', (0, checkAuth_1.checkAuth)(client_1.UserRole.USER, client_1.UserRole.HOSPITAL, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(review_validation_1.createReviewZodSchema), review_controller_1.ReviewController.createReview);
router.get('/', (0, checkAuth_1.checkAuth)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), review_controller_1.ReviewController.getAllReviews);
router.get('/:id', review_controller_1.ReviewController.getReviewById);
router.patch('/:id', (0, checkAuth_1.checkAuth)(client_1.UserRole.USER, client_1.UserRole.HOSPITAL, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(review_validation_1.updateReviewZodSchema), review_controller_1.ReviewController.updateReview);
router.delete('/:id', (0, checkAuth_1.checkAuth)(client_1.UserRole.USER, client_1.UserRole.HOSPITAL, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), review_controller_1.ReviewController.deleteReview);
exports.reviewRoutes = router;
//# sourceMappingURL=review.routes.js.map