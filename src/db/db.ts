import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const MongoURL: string = process.env.MONGODB_URL as string;

export const connect = async () => {
    try {
        await mongoose.connect(MongoURL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }).then(() => {
            console.log({ message: 'Successfully connected' });
        });
    } catch (error) {
        console.log({ message: 'Error when connecting to database', error });
    }
};

export const disconnect = async () => {
    try {
        await mongoose.disconnect().then(() => {
            console.log({ message: 'Successfully disconnect' });
        });
    } catch (error) {
        console.log({ message: 'Error when disconnect from database', error });
    }
};
