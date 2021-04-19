"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userExpenseRouter = void 0;
var express_1 = __importDefault(require("express"));
var UserExpenseController_1 = require("../controllers/UserExpenseController");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var route = express_1.default();
exports.userExpenseRouter = route;
route.get('/expenses-employee', [authMiddleware_1.authMiddleware], UserExpenseController_1.UserExpenseController.getUserExpensesList);
route.post('/expense-employee', [authMiddleware_1.authMiddleware], UserExpenseController_1.UserExpenseController.create);
route.delete('/expense-employee/:id', [authMiddleware_1.authMiddleware], UserExpenseController_1.UserExpenseController.delete);
