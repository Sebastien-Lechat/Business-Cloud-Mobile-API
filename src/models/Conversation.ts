import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    userId1: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
}, { timestamps: true });

const Conversation = mongoose.model('conversation', conversationSchema);

export { Conversation };
