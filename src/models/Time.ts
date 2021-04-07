import mongoose from 'mongoose';

const timeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'project',
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'task',
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
