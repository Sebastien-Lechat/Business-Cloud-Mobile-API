"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteIndex = void 0;
var express_1 = __importDefault(require("express"));
var accountRoute_1 = require("./accountRoute");
var articleRoute_1 = require("./articleRoute");
var authRoute_1 = require("./authRoute");
var billRoute_1 = require("./billRoute");
var clientRoute_1 = require("./clientRoute");
var conversationRoute_1 = require("./conversationRoute");
var employeeRoute_1 = require("./employeeRoute");
var estimateRoute_1 = require("./estimateRoute");
var expenseRoute_1 = require("./expenseRoute");
var projectRoute_1 = require("./projectRoute");
var taskRoute_1 = require("./taskRoute");
var timeRoute_1 = require("./timeRoute");
var userExpenseRoute_1 = require("./userExpenseRoute");
var route = express_1.default();
exports.RouteIndex = route;
route.use(authRoute_1.authRouter);
route.use(accountRoute_1.accountRouter);
route.use(employeeRoute_1.employeeRouter);
route.use(clientRoute_1.clientRouter);
route.use(billRoute_1.billRouter);
route.use(estimateRoute_1.estimateRouter);
route.use(articleRoute_1.articleRouter);
route.use(conversationRoute_1.conversationRouter);
route.use(userExpenseRoute_1.userExpenseRouter);
route.use(expenseRoute_1.expenseRouter);
route.use(projectRoute_1.projectRouter);
route.use(taskRoute_1.taskRouter);
route.use(timeRoute_1.timeRouter);