import mongoose from 'mongoose';

const ActionSchema = new mongoose.Schema({
    method: {
        type: String,
        required: [true, 'method required']
    },
    route: {
        type: String,
        required: [true, 'route required']
    },
}, { _id: false });

const HistorySchema = new mongoose.Schema({
    action: {
        type: ActionSchema,
        required: [true, 'Action required']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Email required']
    },
    success: {
        type: Boolean,
        required: [true, 'Success required']
    }
}, { timestamps: true });

const History = mongoose.model('history', HistorySchema);

export { History };
