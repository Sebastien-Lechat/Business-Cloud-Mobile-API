"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientRouter = void 0;
var express_1 = __importDefault(require("express"));
var ClientController_1 = require("../controllers/ClientController");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var route = express_1.default();
exports.clientRouter = route;
route.post('/customer', [authMiddleware_1.authMiddleware], ClientController_1.ClientController.create);
route.put('/customer', [authMiddleware_1.authMiddleware], ClientController_1.ClientController.update);
route.delete('/customer/:id', [authMiddleware_1.authMiddleware], ClientController_1.ClientController.delete);
