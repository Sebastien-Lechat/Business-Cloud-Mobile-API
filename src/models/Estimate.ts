import mongoose from 'mongoose';

const estimateSchema = new mongoose.Schema({
    estimateNum: {
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
    },
    enterpriseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    articles: [{
        articleId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        quantity: {
            type: Number,
        }
    }],
    taxe: {
        type: Number,
    },
    currency: {
        type: Number,
    },
    totalTTC: {
        type: Number,
    },
    totalHT: {
        type: Number,
    },
    deadline: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

const Estimate = mongoose.model('estimate', estimateSchema);

export { Estimate };
