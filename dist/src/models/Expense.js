"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expense = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var expenseSchema = new mongoose_1.default.Schema({
    expenseNum: {
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
        ref: 'user'
    },
    projectId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    file: {
        type: String,
    },
    description: {
        type: String,
    },
    billable: {
        type: Boolean,
        default: 'true',
    },
}, { timestamps: true });
var Expense = mongoose_1.default.model('expense', expenseSchema);
exports.Expense = Expense;
