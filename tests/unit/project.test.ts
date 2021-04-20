jest.useFakeTimers();

require('../../src/db/db');
import express, { NextFunction, Request, Response } from 'express';
import { projectRouter } from '../../src/routes/projectRoute';


const app: express.Application = express();

app.use(express.json());

// tslint:disable-next-line: no-shadowed-variable
app.use((error: any, request: Request, response: Response, next: NextFunction) => {
    if (error !== null) {
        return response.status(400).json({ success: false, message: 'Invalid json' });
    }
    return next();
});

app.use(projectRouter);

/*
 *  ------------------------------------------------------------- Project -------------------------------------------------------------
 */

describe('Project system', () => {
    describe('POST xxxx/xxxxx', () => {
        test('Success - xxxxxxx', async done => {
            done();
        });
    });
});
