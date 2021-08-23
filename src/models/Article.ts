import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    accountNumber: {
        type: Number,
        required: true,
    },
    tva: {
        type: Number,
    },
    description: {
        type: String,
    },
    showAutoComplete: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const Article = mongoose.model('article', articleSchema);

export { Article };
