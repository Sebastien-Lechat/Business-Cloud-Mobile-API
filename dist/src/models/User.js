"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
    },
    avatar: {
        type: String,
    },
    birthdayDate: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    attempt: {
        type: Number,
        default: 0,
    },
    lastLogin: {
        type: Number,
        default: Date.now(),
    },
    reset_password: {
        token: {
            type: String
        },
        date: {
            type: Number
        }
    },
    double_authentification: {
        activated: {
            type: Boolean
        },
        code: {
            type: String
        },
        date: {
            type: Number
        }
    },
    verify_email: {
        code: {
            type: String
        },
        date: {
            type: Number
        },
        verified: {
            type: Boolean
        }
    },
    role: {
        type: String,
    },
    currency: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
var User = mongoose_1.default.model('user', userSchema);
exports.User = User;
