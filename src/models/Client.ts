import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true],
    },
    email: {
        type: String,
        required: [true],
    },
    phone: {
        type: String,
    },
    avatar: {
        type: String,
    },
    birthdayDate: {
        type: Date,
    },
    password: {
        type: String,
        required: [true],
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
        type: mongoose.Schema.Types.ObjectId,
    },
    currency: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const Client = mongoose.model('client', clientSchema);

export { Client };
