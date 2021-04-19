"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var articleSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    accountNumber: {
        type: Number,
        required: true,
    },
    tva: {
        type: Number,
    },
    description: {
        type: String,
    },
}, { timestamps: true });
var Article = mongoose_1.default.model('article', articleSchema);
exports.Article = Article;
