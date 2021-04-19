"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var taskSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    progression: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
    },
    projectId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'project',
    },
    employees: [{
            _id: false,
            id: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'user',
            }
        }],
    startDate: {
        type: Date,
        default: new Date(),
    },
    deadline: {
        type: Date,
        required: true,
    },
    estimateHour: {
        type: Number,
    },
}, { timestamps: true });
var Task = mongoose_1.default.model('task', taskSchema);
exports.Task = Task;
