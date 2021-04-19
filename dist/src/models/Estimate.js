"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Estimate = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var estimateSchema = new mongoose_1.default.Schema({
    estimateNum: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    clientId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'client'
    },
    enterpriseId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'enterprise'
    },
    articles: [{
            _id: false,
            articleId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'article'
            },
            quantity: {
                type: Number,
            }
        }],
    currency: {
        type: String,
    },
    totalTTC: {
        type: Number,
    },
    totalHT: {
        type: Number,
    },
    deadline: {
        type: Date,
        required: true,
    },
}, { timestamps: true });
var Estimate = mongoose_1.default.model('estimate', estimateSchema);
exports.Estimate = Estimate;
