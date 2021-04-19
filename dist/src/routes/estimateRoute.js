"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateRouter = void 0;
var express_1 = __importDefault(require("express"));
var Estimatecontroller_1 = require("../controllers/Estimatecontroller");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var route = express_1.default();
exports.estimateRouter = route;
route.get('/estimates', [authMiddleware_1.authMiddleware], Estimatecontroller_1.EstimateController.getEstimatesList);
route.get('/estimate/:id', [authMiddleware_1.authMiddleware], Estimatecontroller_1.EstimateController.getOneEstimate);
route.post('/estimate', [authMiddleware_1.authMiddleware], Estimatecontroller_1.EstimateController.create);
route.put('/estimate', [authMiddleware_1.authMiddleware], Estimatecontroller_1.EstimateController.update);
route.delete('/estimate/:id', [authMiddleware_1.authMiddleware], Estimatecontroller_1.EstimateController.delete);
