import mongoose from 'mongoose';

const userExpenseSchema = new mongoose.Schema({
    userExpenseNum: {
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
        ref: 'user',
    },
    file: {
        type: String,
    },
    description: {
        type: String,
    },
}, { timestamps: true });

const UserExpense = mongoose.model('userExpense', userExpenseSchema);

export { UserExpense };
