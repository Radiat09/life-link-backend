"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const client_1 = require("@prisma/client");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const multer_config_1 = require("../../config/multer.config");
const router = express_1.default.Router();
router.get("/", (0, checkAuth_1.checkAuth)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), user_controller_1.UserController.getAllFromDB);
router.get('/me', (0, checkAuth_1.checkAuth)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.USER, client_1.UserRole.HOSPITAL), user_controller_1.UserController.getMyProfile);
router.post("/", (0, validateRequest_1.validateRequest)(user_validation_1.userValidation.createUserZodSchema), user_controller_1.UserController.createUser);
router.patch('/:id/status', (0, checkAuth_1.checkAuth)(client_1.UserRole.ADMIN), user_controller_1.UserController.changeProfileStatus);
router.patch("/update-my-profile", multer_config_1.multerWithErrorHandling.single('file'), (0, checkAuth_1.checkAuth)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.USER, client_1.UserRole.HOSPITAL), (0, validateRequest_1.validateRequest)(user_validation_1.userValidation.updateProfileZodSchema), user_controller_1.UserController.updateMyProfile);
exports.userRoutes = router;
//# sourceMappingURL=user.routes.js.map