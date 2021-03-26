import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name required'],
        validate: (value: string) => {
            if (value.length > 55) { throw { success: false, message: 'Invalid name : Too long' }; }
        }
    }
}, { timestamps: true });

const User = mongoose.model('user', userSchema);

export { User };
