"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeRouter = void 0;
var express_1 = __importDefault(require("express"));
var EmployeeController_1 = require("../controllers/EmployeeController");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var route = express_1.default();
exports.employeeRouter = route;
route.post('/employee', [authMiddleware_1.authMiddleware], EmployeeController_1.EmployeeController.create);
route.put('/employee', [authMiddleware_1.authMiddleware], EmployeeController_1.EmployeeController.update);
route.delete('/employee/:id', [authMiddleware_1.authMiddleware], EmployeeController_1.EmployeeController.delete);
