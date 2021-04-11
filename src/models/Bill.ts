import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
    billNum: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'client'
    },
    enterpriseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'enterprise'
    },
    articles: [{
        _id: false,
        articleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'article'
        },
        quantity: {
            type: Number,
        }
    }],
    currency: {
        type: String,
    },
    totalTTC: {
        type: Number,
    },
    totalHT: {
        type: Number,
    },
    amountPaid: {
        type: Number,
        default: 0,
    },
    payementDate: {
        type: Date,
    },
    deadline: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

const Bill = mongoose.model('bill', billSchema);

export { Bill };
