"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("../modules/auth/auth.routes");
const user_routes_1 = require("../modules/user/user.routes");
const bloodRequest_route_1 = require("../modules/bloodRequest/bloodRequest.route");
const donation_routes_1 = require("../modules/donations/donation.routes");
const review_routes_1 = require("../modules/reviews/review.routes");
const notification_routes_1 = require("../modules/notifications/notification.routes");
const bloodInventory_routes_1 = require("../modules/bloodInventory/bloodInventory.routes");
const admin_routes_1 = require("../modules/admin/admin.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_routes_1.authRoutes,
    },
    {
        path: '/user',
        route: user_routes_1.userRoutes,
    },
    {
        path: '/blood-requests',
        route: bloodRequest_route_1.bloodRequestRoutes,
    },
    {
        path: '/donations',
        route: donation_routes_1.donationRoutes,
    },
    {
        path: '/reviews',
        route: review_routes_1.reviewRoutes,
    },
    {
        path: '/notifications',
        route: notification_routes_1.notificationRoutes,
    },
    {
        path: '/blood-inventory',
        route: bloodInventory_routes_1.bloodInventoryRoutes,
    },
    {
        path: '/admin',
        route: admin_routes_1.adminRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
//# sourceMappingURL=index.js.map