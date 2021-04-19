"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conversation = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var conversationSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    userId1: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    }
}, { timestamps: true });
var Conversation = mongoose_1.default.model('conversation', conversationSchema);
exports.Conversation = Conversation;
