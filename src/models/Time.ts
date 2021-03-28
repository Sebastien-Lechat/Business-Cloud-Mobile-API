import mongoose from 'mongoose';

const timeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    billable: {
        type: Boolean,
        default: 'true',
    },
    duration: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

const Time = mongoose.model('time', timeSchema);

export { Time };
