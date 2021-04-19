"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enterprise = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var entrepriseSchema = new mongoose_1.default.Schema({
    address: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    activity: {
        type: String,
        required: true,
    },
    numTVA: {
        type: String,
        required: true,
    },
    numRCS: {
        type: String,
        required: true,
    },
    numSIRET: {
        type: String,
        required: true,
    },
}, { timestamps: true });
var Enterprise = mongoose_1.default.model('enterprise', entrepriseSchema);
exports.Enterprise = Enterprise;
