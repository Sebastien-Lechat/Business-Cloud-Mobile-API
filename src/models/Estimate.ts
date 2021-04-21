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
    reduction: {
        type: Number,
        default: 0,
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
