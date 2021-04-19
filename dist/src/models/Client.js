"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var clientSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
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
    address: {
        type: String,
    },
    zip: {
        type: String,
    },
    city: {
        type: String,
    },
    country: {
        type: String,
    },
    activity: {
        type: String,
    },
    numTVA: {
        type: String,
    },
    numRCS: {
        type: String,
    },
    numSIRET: {
        type: String,
    },
    note: {
        type: String,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user'
    },
    currency: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
var Client = mongoose_1.default.model('client', clientSchema);
exports.Client = Client;
