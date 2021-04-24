import { connect, disconnect } from '../../src/db/db';
(async () => {
    await connect();
})();
import express, { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { billRouter } from '../../src/routes/billRoute';

const app: express.Application = express();

app.use(express.json());

// tslint:disable-next-line: no-shadowed-variable
app.use((error: any, request: Request, response: Response, next: NextFunction) => {
    if (error !== null) {
        return response.status(400).json({ success: false, message: 'Invalid json' });
    }
    return next();
});

app.use('/api', billRouter);

const uuidUser1 = uuidv4();

// tslint:disable-next-line: prefer-const
let gerant: any = {
    name: 'Name_' + uuidUser1,
    email: uuidUser1 + '@gmail.com',
    password: 'Azerty1!',
    phone: '0601111111',
    role: 'Gérant',
};

const uuidUser2 = uuidv4();

// tslint:disable-next-line: prefer-const
let employee: any = {
    name: 'Name_' + uuidUser2,
    email: uuidUser2 + '@gmail.com',
    password: 'Azerty1!',
    phone: '0601111111',
    role: 'Développeur'
};

const uuidUser3 = uuidv4();

// tslint:disable-next-line: prefer-const
let customer: any = {
    name: 'Name_' + uuidUser3,
    email: uuidUser3 + '@gmail.com',
    password: 'Azerty1!',
    phone: '0601111111',
    address: '51 avenue de Paris',
    zip: '75000',
    city: 'Paris',
    country: 'France',
};

/*
 *  ------------------------------------------------------------- Bill -------------------------------------------------------------
 */

describe('Bill system', () => {
    describe('GET /Bills', () => {
        test('Success - Bill list', async done => {
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
