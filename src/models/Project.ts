import mongoose from 'mongoose';

const projectBilling = new mongoose.Schema({
    billableTime: {
        type: Number,
    },
    additionalExpense: {
        type: Number,
    }
}, { _id: false });

const projectSchema = new mongoose.Schema({
    projectNum: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'client',
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
        required: true,
    },
    description: {
        type: String,
    },
    employees: [{
        _id: false,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        }
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
    billing: {
        type: projectBilling,

    }
}, { timestamps: true });

const Project = mongoose.model('project', projectSchema);

export { Project };
