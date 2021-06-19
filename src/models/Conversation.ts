import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    member1: {
        type: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'member1.type'
        }
    },
    member2: {
        type: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'member2.type'
        }
    },
    lastMessage: {
        text: {
            type: String
        },
        user: {
            type: mongoose.Schema.Types.ObjectId
        }
    }
}, { timestamps: true });

const Conversation = mongoose.model('conversation', conversationSchema);

export { Conversation };
