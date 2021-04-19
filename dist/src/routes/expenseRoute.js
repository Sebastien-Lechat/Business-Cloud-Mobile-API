"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseRouter = void 0;
var express_1 = __importDefault(require("express"));
var ExpenseController_1 = require("../controllers/ExpenseController");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var route = express_1.default();
exports.expenseRouter = route;
route.get('/expenses/:projectId', [authMiddleware_1.authMiddleware], ExpenseController_1.ExpenseController.getExpensesList);
route.post('/expense', [authMiddleware_1.authMiddleware], ExpenseController_1.ExpenseController.create);
route.delete('/expense/:id', [authMiddleware_1.authMiddleware], ExpenseController_1.ExpenseController.delete);
