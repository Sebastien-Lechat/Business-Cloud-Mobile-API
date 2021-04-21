import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    expenseNum: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    file: {
        type: String,
    },
    description: {
        type: String,
    },
    billable: {
        type: Boolean,
        default: 'true',
    },
}, { timestamps: true });

const Expense = mongoose.model('expense', expenseSchema);

export { Expense };
