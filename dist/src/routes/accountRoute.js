"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountRouter = void 0;
var express_1 = __importDefault(require("express"));
var AccountController_1 = require("../controllers/AccountController");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var route = express_1.default();
exports.accountRouter = route;
route.get('/users', [authMiddleware_1.authMiddleware], AccountController_1.AccountController.getUsersList);
route.get('/user/:id', [authMiddleware_1.authMiddleware], AccountController_1.AccountController.getUser);
route.get('/account', [authMiddleware_1.authMiddleware], AccountController_1.AccountController.getProfile);
route.put('/account/information', [authMiddleware_1.authMiddleware], AccountController_1.AccountController.modifyPersonnalInfo);
route.put('/account/password', [authMiddleware_1.authMiddleware], AccountController_1.AccountController.modifyPassword);
route.put('/account/address', [authMiddleware_1.authMiddleware], AccountController_1.AccountController.modifyAddress);
route.put('/account/enterprise', [authMiddleware_1.authMiddleware], AccountController_1.AccountController.modifyEnterprise);
