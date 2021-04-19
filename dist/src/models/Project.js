"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var projectSchema = new mongoose_1.default.Schema({
    projectNum: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    clientId: {
        type: String,
        required: true,
    },
    progression: {
        type: Number,
        default: 0,
    },
    startDate: {
        type: Date,
        default: new Date(),
    },
    deadline: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
    },
    employees: [{
            _id: false,
            id: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'user',
            }
        }],
    fixedRate: {
        type: Number,
    },
    hourlyRate: {
        type: Number,
    },
    estimateHour: {
        type: Number,
    },
}, { timestamps: true });
var Project = mongoose_1.default.model('project', projectSchema);
exports.Project = Project;
