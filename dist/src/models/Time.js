"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Time = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var timeSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
    projectId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'project',
    },
    taskId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'task',
    },
    billable: {
        type: Boolean,
        default: 'true',
    },
    duration: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
var Time = mongoose_1.default.model('time', timeSchema);
exports.Time = Time;
