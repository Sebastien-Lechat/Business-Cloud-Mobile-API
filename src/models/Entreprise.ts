import mongoose from 'mongoose';

const entrepriseSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    activity: {
        type: String,
        required: true,
    },
    numTVA: {
        type: String,
        required: true,
    },
    numRCS: {
        type: String,
        required: true,
    },
    numSIRET: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Enterprise = mongoose.model('enterprise', entrepriseSchema);

export { Enterprise };
