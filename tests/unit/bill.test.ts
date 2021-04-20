import { config } from 'dotenv';
config();
import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../src/models/User';
import { Client } from '../../src/models/Client';
import { hashPassword } from '../../src/helpers/passwordHelper';
import { billRouter } from '../../src/routes/billRoute';

require('../../src/db/db');

const app: express.Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// tslint:disable-next-line: no-shadowed-variable
app.use((error: any, request: Request, response: Response, next: NextFunction) => {
    if (error !== null) {
        return response.status(400).json({ success: false, message: 'Invalid json' });
    }
    return next();
});

app.use(billRouter);


/*
 *  ------------------------------------------------------------- Bill -------------------------------------------------------------
 */

describe('Bill system', () => {
    describe('POST xxxx/xxxxx', () => {
        test('Success - xxxxxxx', async done => {
            done();
        });
    });
});
