"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeRouter = void 0;
var express_1 = __importDefault(require("express"));
var TimeController_1 = require("../controllers/TimeController");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var route = express_1.default();
exports.timeRouter = route;
route.get('/times/projectId', [authMiddleware_1.authMiddleware], TimeController_1.TimeController.getTimesList);
route.post('/time', [authMiddleware_1.authMiddleware], TimeController_1.TimeController.create);
route.delete('/time/:id', [authMiddleware_1.authMiddleware], TimeController_1.TimeController.delete);
