"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
var express_1 = __importDefault(require("express"));
var AuthController_1 = require("../controllers/AuthController");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var route = express_1.default();
exports.authRouter = route;
route.post('/auth/login', AuthController_1.AuthController.login);
route.post('/auth/register', AuthController_1.AuthController.register);
route.post('/auth/request-password-lost', AuthController_1.AuthController.requestPasswordLost);
route.post('/auth/request-verify-email', AuthController_1.AuthController.requestVerifyEmail);
route.post('/auth/verify-email', AuthController_1.AuthController.verifyEmail);
route.post('/auth/request-double-auth', AuthController_1.AuthController.requestDoubleAuth);
route.post('/auth/activate-double-auth', [authMiddleware_1.authMiddleware], AuthController_1.AuthController.activateDoubleAuth);
route.delete('/auth/disconnect', [authMiddleware_1.authMiddleware], AuthController_1.AuthController.logout);
