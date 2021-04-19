"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRouter = void 0;
var express_1 = __importDefault(require("express"));
var TaskController_1 = require("../controllers/TaskController");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var route = express_1.default();
exports.taskRouter = route;
route.get('/tasks/:projectId', [authMiddleware_1.authMiddleware], TaskController_1.TaskController.getTasksList);
route.post('/task', [authMiddleware_1.authMiddleware], TaskController_1.TaskController.create);
route.delete('/task/:id', [authMiddleware_1.authMiddleware], TaskController_1.TaskController.delete);
