jest.useFakeTimers();

require('../../src/db/db');
import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../src/models/User';
import { Client } from '../../src/models/Client';
import { hashPassword } from '../../src/helpers/passwordHelper';
import { authRouter } from '../../src/routes/authRoute';


const app: express.Application = express();

app.use(express.json());

// tslint:disable-next-line: no-shadowed-variable
app.use((error: any, request: Request, response: Response, next: NextFunction) => {
    if (error !== null) {
        return response.status(400).json({ success: false, message: 'Invalid json' });
    }
    return next();
});

app.use(authRouter);

const uuidUser1 = uuidv4();

const validUser: any = {
    name: 'Name_' + uuidUser1,
    email: uuidUser1 + '@gmail.com',
    password: 'Azerty1!',
    role: 'Développeur'
};

const uuidUser2 = uuidv4();

const invalidEmailUser: any = {
    name: 'Name_' + uuidUser2,
    email: uuidUser2 + ';:!@gmail.com',
    password: '1234567',
};

const invalidPhoneUser: any = {
    name: 'Name_' + uuidUser2,
    email: uuidUser2 + '@gmail.com',
    phone: '1234567aaazeqqgqz',
    password: 'Azerty1!',
};

const invalidPasswordUser: any = {
    name: 'Name_' + uuidUser2,
    email: uuidUser2 + '@gmail.com',
    phone: '0601474747',
    password: '1234567',
};

const invalidDateUser: any = {
    name: 'Name_' + uuidUser2,
    email: uuidUser2 + '@gmail.com',
    phone: '0601474747',
    password: 'Azerty1!',
    birthdayDate: 'zzz-ad-478'
};

/*
 *  ------------------------------------------------------------- Authentification -------------------------------------------------------------
 */

describe('Authentification system', () => {
    describe('POST auth/register', () => {
        test('Success - register', async done => {
            const res = await request(app)
                .post('/auth/register')
                .send(validUser)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201);
            expect(res.body.error).toBe(false);
            expect(res.body.message).toBe('Successfully registred');
            expect(res.body.user.id).not.toBe(undefined);
            expect(res.body.user.name).not.toBe(undefined);
            expect(res.body.user.email).not.toBe(undefined);

            done();
        });

        test('Error - Missing important fields', async done => {
            const res = await request(app)
                .post('/auth/register')
                .send({ name: invalidEmailUser.name })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('101051');
            done();
        });

        test('Error - Invalid email addresse', async done => {
            const res = await request(app)
                .post('/auth/register')
                .send(invalidEmailUser)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('101052');

            done();
        });

        test('Error - Invalid phone number', async done => {
            const res = await request(app)
                .post('/auth/register')
                .send(invalidPhoneUser)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('101053');

            done();
        });

        test('Error - Invalid password format', async done => {
            const res = await request(app)
                .post('/auth/register')
                .send(invalidPasswordUser)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('101054');
            done();
        });
        test('Error - Invalid TVA number', async done => {
            done();
        });
        test('Error - Invalid SIRET number', async done => {
            done();
        });
        test('Error - Invalid RCS number', async done => {
            done();
        });
        test('Error - Invalid date format', async done => {
            const res = await request(app)
                .post('/auth/register')
                .send(invalidDateUser)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('101058');
            done();
        });
        test('Error - This email is already used', async done => {
            const res = await request(app)
                .post('/auth/register')
                .send(validUser)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('101059');

            await Client.deleteOne({ email: validUser.email });

            done();
        });
    });

    describe('POST auth/verify-email', () => {
        test('Success - verify email', async done => {

            validUser.password = await hashPassword(validUser.password);
            await User.create(validUser);

            const resRequest = await request(app)
                .post('/auth/request-verify-email')
                .send({ email: validUser.email })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(resRequest.body.error).toBe(false);
            expect(resRequest.body.message).toBe('Email successfully send');

            const code = (await User.findOne({ email: validUser.email })).verify_email.code;

            const res = await request(app)
                .post('/auth/verify-email')
                .send({ email: validUser.email, code: code })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body.error).toBe(false);
            expect(res.body.message).toBe('Successful verification');

            done();
        });

        test('Error - Missing email field', async done => {
            const res = await request(app)
                .post('/auth/request-verify-email')
                .send()
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('101151');

            done();
        });

        test('Error - Invalid email address', async done => {
            const res = await request(app)
                .post('/auth/request-verify-email')
                .send({ email: invalidEmailUser.email })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('101152');

            done();
        });

        test('Error - Email already verified', async done => {
            const resRequest = await request(app)
                .post('/auth/request-verify-email')
                .send({ email: validUser.email })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(resRequest.body.error).toBe(true);
            expect(resRequest.body.code).toBe('101153');

            done();
        });

        test('Error - Missing email or code field', async done => {
            const res = await request(app)
                .post('/auth/verify-email')
                .send()
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('101201');

            done();
        });

        test('Error - Invalid user information', async done => {
            const res = await request(app)
                .post('/auth/verify-email')
                .send({ email: validUser.email + 'aaa', code: '123456' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('101203');

            done();
        });

        test('Error - Wrong code', async done => {
            const res = await request(app)
                .post('/auth/verify-email')
                .send({ email: validUser.email, code: '111111' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('101205');

            done();
        });

        test('Error - This code is no longer valid', async done => {
            await User.updateOne({ email: validUser.email }, { $set: { verify_email: { code: 111111, date: 55555, verified: true } } });

            const res = await request(app)
                .post('/auth/verify-email')
                .send({ email: validUser.email, code: '111111' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('101206');

            done();
        });
    });

    describe('POST auth/login', () => {
        test('Success - login', async done => {
            const res = await request(app)
                .post('/auth/login')
                .send({ email: validUser.email, password: 'Azerty1!' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body.error).toBe(false);
            expect(res.body.message).toBe('Successfully connected');
            expect(res.body.user.type).not.toBe(undefined);
            expect(res.body.user.id).not.toBe(undefined);
            expect(res.body.user.name).not.toBe(undefined);
            expect(res.body.user.email).not.toBe(undefined);
            expect(res.body.user.token).not.toBe(undefined);
            expect(res.body.user.refreshToken).not.toBe(undefined);
            expect(res.body.user.createdAt).not.toBe(undefined);
            expect(res.body.user.updatedAt).not.toBe(undefined);

            validUser.token = res.body.user.token;

            done();
        });

        test('Error - Missing email or password field', async done => {
            const res = await request(app)
                .post('/auth/login')
                .send({ email: validUser.email })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('101001');

            done();
        });

        test('Error - Invalid email addresse', async done => {
            const res = await request(app)
                .post('/auth/login')
                .send({ email: invalidEmailUser.email, password: invalidEmailUser.password })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('101002');

            done();
        });

        test('Error - Invalid login credential', async done => {
            const res = await request(app)
                .post('/auth/login')
                .send({ email: validUser.email, password: 'Azertyyyyy' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('101003');

            const res2 = await request(app)
                .post('/auth/login')
                .send({ email: invalidPasswordUser.email, password: 'Azertyyyyy' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res2.body.error).toBe(true);
            expect(res2.body.code).toBe('101003');

            done();
        });

        test('Error - Double authentification is activated, code is required', async done => {
            await User.updateOne({ email: validUser.email }, { $set: { double_authentification: { code: 111111, date: 55555, activated: true } } });

            const res = await request(app)
                .post('/auth/login')
                .send({ email: validUser.email, password: 'Azerty1!' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('101005');

            done();
        });

        test('Error - Wrong code', async done => {
            const res = await request(app)
                .post('/auth/login')
                .send({ email: validUser.email, password: 'Azerty1!', code: '1245879' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('101006');

            done();
        });

        test('Error - This code is no longer valid', async done => {
            const res = await request(app)
                .post('/auth/login')
                .send({ email: validUser.email, password: 'Azerty1!', code: '111111' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('101007');

            done();
        });

        test('Error - Email address is not verified', async done => {
            await User.updateOne({ email: validUser.email }, { $set: { double_authentification: { code: 0, date: 0, activated: false } } });
            await User.updateOne({ email: validUser.email }, { $set: { verify_email: { code: 0, date: 0, verified: false } } });

            const res = await request(app)
                .post('/auth/login')
                .send({ email: validUser.email, password: 'Azerty1!' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('101004');

            done();
        });

        test('Error - Too many attempts on this email', async done => {
            await User.updateOne({ email: validUser.email }, { $set: { verify_email: { code: 0, date: 0, verified: true }, attempt: 5 } });

            const res = await request(app)
                .post('/auth/login')
                .send({ email: validUser.email, password: 'Azerty1!' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('101009');

            done();
        });

        test('Error - This account is disabled', async done => {
            await User.updateOne({ email: validUser.email }, { $set: { isActive: false }, attempt: 0 });

            const res = await request(app)
                .post('/auth/login')
                .send({ email: validUser.email, password: 'Azerty1!' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('101008');

            done();
        });
    });

    describe('POST auth/password-lost', () => {
        test('Success - Password lost', async done => {
            const res = await request(app)
                .post('/auth/request-password-lost')
                .send({ email: validUser.email })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body.error).toBe(false);
            expect(res.body.message).toBe('Email successfully send');

            done();
        });
        test('Error - Missing email field', async done => {
            const res = await request(app)
                .post('/auth/request-password-lost')
                .send()
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('101101');

            done();
        });
        test('Error - Invalid email addresse', async done => {
            const res = await request(app)
                .post('/auth/request-password-lost')
                .send({ email: invalidEmailUser.email })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('101102');

            done();
        });
    });

    describe('POST auth/disconnect', () => {
        test('Success - Logout', async done => {
            const res = await request(app)
                .delete('/auth/disconnect')
                .send()
                .set('Accept', 'application/json')
                .set({ Authorization: validUser.token })
                .expect('Content-Type', /json/)
                .expect(200);

            expect(res.body.error).toBe(false);
            expect(res.body.message).toBe('Successfully logout');

            await User.deleteOne({ email: validUser.email });

            done();
        });
    });
});


