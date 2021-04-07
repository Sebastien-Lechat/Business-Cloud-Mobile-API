import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    progression: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'project',
    },
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    startDate: {
        type: Date,
        default: new Date(),
    },
    deadline: {
        type: Date,
        required: true,
    },
    estimateHour: {
        type: Number,
    },
}, { timestamps: true });

const Task = mongoose.model('task', taskSchema);

export { Task };
