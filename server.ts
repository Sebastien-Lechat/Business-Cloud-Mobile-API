import { config } from 'dotenv';
import { connect } from './src/db/db';
import { RouteIndex } from './src/routes';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import SocketIO from 'socket.io';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { CronTask } from './src/scripts/cron';

config();
connect();

const port: string | number = process.env.PORT || 5000;

const app: express.Application = express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((error: any, request: Request, response: Response, next: NextFunction) => {
    if (error !== null) {
        return response.status(400).json({ success: false, message: 'Invalid json' });
    }
    return next();
});

const limiter: rateLimit.RateLimit = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 500 // Nombre max de requêtes par minutes
});

const http = createServer(app);

const io: SocketIO.Server = new Server(http, { path: '/socketio', serveClient: false, cors: { origin: '*' } });
require('./src/sockets/index')(io);
app.set('io', io);

app.use(limiter);
app.use('/api', RouteIndex);

http.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const cron = new CronTask();
cron.startTask();
