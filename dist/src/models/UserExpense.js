"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserExpense = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var userExpenseSchema = new mongoose_1.default.Schema({
    userExpenseNum: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
    file: {
        type: String,
    },
    description: {
        type: String,
    },
}, { timestamps: true });
var UserExpense = mongoose_1.default.model('userExpense', userExpenseSchema);
exports.UserExpense = UserExpense;
