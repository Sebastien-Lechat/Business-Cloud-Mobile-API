import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'conversation'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    seen: {
        type: Boolean,
        required: true,
    }
}, { timestamps: true });

const Message = mongoose.model('message', messageSchema);

export { Message };
