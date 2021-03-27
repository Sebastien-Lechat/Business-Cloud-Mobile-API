import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true],
    },
    price: {
        type: Number,
        required: [true],
    },
    accountNumber: {
        type: Number,
        required: [true],
    },
    tva: {
        type: Number,
    },
    description: {
        type: String,
    },
}, { timestamps: true });

const Article = mongoose.model('article', articleSchema);

export { Article };
