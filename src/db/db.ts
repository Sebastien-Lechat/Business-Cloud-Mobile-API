import mongoose from 'mongoose';
import { config } from "dotenv";

config();

const MongoURL: string = process.env.MONGODB_URL as string;

mongoose.connect(MongoURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})