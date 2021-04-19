"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationRouter = void 0;
var express_1 = __importDefault(require("express"));
var ConversationController_1 = require("../controllers/ConversationController");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var route = express_1.default();
exports.conversationRouter = route;
route.get('/conversations', [authMiddleware_1.authMiddleware], ConversationController_1.ConversationController.getConversationsList);
route.post('/conversation', [authMiddleware_1.authMiddleware], ConversationController_1.ConversationController.create);
route.delete('/conversation/:id', [authMiddleware_1.authMiddleware], ConversationController_1.ConversationController.delete);
