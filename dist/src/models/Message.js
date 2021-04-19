"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var messageSchema = new mongoose_1.default.Schema({
    conversationId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'conversation'
    },
    text: {
        type: String,
        required: true,
    }
}, { timestamps: true });
var Message = mongoose_1.default.model('conversation', messageSchema);
exports.Message = Message;
