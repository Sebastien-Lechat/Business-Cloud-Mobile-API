import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const MongoURL: string = process.env.MONGODB_URL as string;

export const db = (async () => {
    try {
        await mongoose.connect(MongoURL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
    } catch (error) {
        console.log({ message: 'Error when connecting to database', error });
    }
})();
