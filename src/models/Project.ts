import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    projectNum: {
        type: String,
        required: [true],
    },
    title: {
        type: String,
        required: [true],
    },
    status: {
        type: String,
        required: [true],
    },
    clientId: {
        type: String,
        required: [true],
    },
    progression: {
        type: Number,
        default: 0,
    },
    startDate: {
        type: Date,
        default: new Date(),
    },
    deadline: {
        type: Date,
        required: [true],
    },
    description: {
        type: String,
    },
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    fixedRate: {
        type: Number,
    },
    hourlyRate: {
        type: Number,
    },
    estimateHour: {
        type: Number,
    },
}, { timestamps: true });

const Project = mongoose.model('project', projectSchema);

export { Project };
