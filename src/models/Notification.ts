import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    category: {
        type: String,
    },
    seen: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const Notification = mongoose.model('notification', notificationSchema);

export { Notification };
