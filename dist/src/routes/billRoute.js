"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.billRouter = void 0;
var express_1 = __importDefault(require("express"));
var BillController_1 = require("../controllers/BillController");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var route = express_1.default();
exports.billRouter = route;
route.get('/bills', [authMiddleware_1.authMiddleware], BillController_1.BillController.getBillsList);
route.get('/bill/:id', [authMiddleware_1.authMiddleware], BillController_1.BillController.getOneBill);
route.post('/bill', [authMiddleware_1.authMiddleware], BillController_1.BillController.create);
route.put('/bill', [authMiddleware_1.authMiddleware], BillController_1.BillController.update);
route.delete('/bill/:id', [authMiddleware_1.authMiddleware], BillController_1.BillController.delete);
