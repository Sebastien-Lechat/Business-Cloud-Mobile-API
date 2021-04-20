import { connect, disconnect } from '../../src/db/db';
(async () => {
    await connect();
})();
import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../src/models/User';
import { Client } from '../../src/models/Client';
import { hashPassword } from '../../src/helpers/passwordHelper';
import { estimateRouter } from '../../src/routes/estimateRoute';


const app: express.Application = express();

app.use(express.json());

// tslint:disable-next-line: no-shadowed-variable
app.use((error: any, request: Request, response: Response, next: NextFunction) => {
    if (error !== null) {
        return response.status(400).json({ success: false, message: 'Invalid json' });
    }
    return next();
});

app.use(estimateRouter);

/*
 *  ------------------------------------------------------------- Estimate -------------------------------------------------------------
 */

describe('Estimate system', () => {
    describe('POST xxxx/xxxxx', () => {
        test('Success - xxxxxxx', async done => {
            done();
        });
    });
    describe('Disconnect database', () => {
        test('Success - Disconnect', async done => {
            await disconnect();
            done();
        });
    });
});
