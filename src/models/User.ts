import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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
    },
    lastLogin: {
        type: Date,
        default: new Date(),
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
    currency: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const User = mongoose.model('user', userSchema);

export { User };
