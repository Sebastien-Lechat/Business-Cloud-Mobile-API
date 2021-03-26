import { config } from 'dotenv';
config();
require('./src/db/db');
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { RouteIndex } from './src/routes';


const port: string | undefined = process.env.PORT;

const app: express.Application = express();
app.use(cors());

// let http = require('http').createServer(app);

app.use(express.json());

app.use((error: any, request: Request, response: Response, next: NextFunction) => {
    if (error !== null) {
        return response.status(400).json({ success: false, message: 'Invalid json' });
    }
    return next();
});

const limiter: rateLimit.RateLimit = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.use(RouteIndex);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
