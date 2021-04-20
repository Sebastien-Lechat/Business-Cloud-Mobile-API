import { config } from 'dotenv';
config();
import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../src/models/User';
import { userUtils } from '../../src/utils/userUtils';
import { Client } from '../../src/models/Client';
import { accountRouter } from '../../src/routes/accountRoute';
import { hashPassword } from '../../src/helpers/passwordHelper';

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

app.use(accountRouter);

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

let employee: any = {
    name: 'Name_' + uuidUser2,
    email: uuidUser2 + '@gmail.com',
    password: 'Azerty1!',
    phone: '0601111111',
    role: 'Développeur'
};

const uuidUser3 = uuidv4();

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
 *  ------------------------------------------------------------- Account -------------------------------------------------------------
 */


describe('Account system', () => {
    describe('GET /account', () => {
        test('Success - Get user profile - Employee', async done => {
            employee.password = await hashPassword(employee.password);
            employee = await User.create(employee);
            employee.token = await userUtils.generateUserToken({ data: employee, type: 'user' });
            employee.refreshToken = await userUtils.generateUserRefreshToken({ data: employee, type: 'user' });
            await User.updateOne({ email: employee.email }, { $set: { verify_email: { code: 0, date: 0, verified: true }, token: employee.token, refreshToken: employee.refreshToken } });

            const res = await request(app)
                .get('/account')
                .set({ Authorization: employee.token })
                .expect('Content-Type', /json/)
                .expect(200);

            expect(res.body.error).toBe(false);
            expect(res.body.message).toBe('Successful profil acquisition');
            expect(res.body.user.type).not.toBe(undefined);
            expect(res.body.user.id).not.toBe(undefined);
            expect(res.body.user.name).not.toBe(undefined);
            expect(res.body.user.email).not.toBe(undefined);
            expect(res.body.user.token).not.toBe(undefined);
            expect(res.body.user.refreshToken).not.toBe(undefined);
            expect(res.body.user.createdAt).not.toBe(undefined);
            expect(res.body.user.updatedAt).not.toBe(undefined);

            done();
        });

        test('Success - Get user profile - Customer', async done => {
            customer.password = await hashPassword(customer.password);
            customer = await Client.create(customer);
            customer.token = await userUtils.generateUserToken({ data: customer, type: 'user' });
            customer.refreshToken = await userUtils.generateUserRefreshToken({ data: customer, type: 'user' });
            await Client.updateOne({ email: customer.email }, { $set: { verify_email: { code: 0, date: 0, verified: true }, token: customer.token, refreshToken: customer.refreshToken } });

            const res = await request(app)
                .get('/account')
                .set({ Authorization: customer.token })
                .expect('Content-Type', /json/)
                .expect(200);

            expect(res.body.error).toBe(false);
            expect(res.body.message).toBe('Successful profil acquisition');
            expect(res.body.user.type).not.toBe(undefined);
            expect(res.body.user.id).not.toBe(undefined);
            expect(res.body.user.name).not.toBe(undefined);
            expect(res.body.user.email).not.toBe(undefined);
            expect(res.body.user.token).not.toBe(undefined);
            expect(res.body.user.refreshToken).not.toBe(undefined);
            expect(res.body.user.createdAt).not.toBe(undefined);
            expect(res.body.user.updatedAt).not.toBe(undefined);

            done();
        });
    });

    describe('PUT /account/information', () => {
        test('Success - Update user information', async done => {
            const res = await request(app)
                .put('/account/information')
                .send()
                .set({ Authorization: employee.token })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body.error).toBe(false);
            expect(res.body.message).toBe('Profile successfully updated');
            expect(res.body.user.type).not.toBe(undefined);
            expect(res.body.user.id).not.toBe(undefined);
            expect(res.body.user.name).not.toBe(undefined);
            expect(res.body.user.email).not.toBe(undefined);
            expect(res.body.user.token).not.toBe(undefined);
            expect(res.body.user.refreshToken).not.toBe(undefined);
            expect(res.body.user.createdAt).not.toBe(undefined);
            expect(res.body.user.updatedAt).not.toBe(undefined);

            done();
        });
        test('Error - Invalid email addresse', async done => {
            const res = await request(app)
                .put('/account/information')
                .send({ email: 'aaaaaaaaaaaaa' })
                .set({ Authorization: employee.token })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('102051');

            done();
        });
        test('Error - Invalid phone number', async done => {
            const res = await request(app)
                .put('/account/information')
                .send({ phone: 'aaaaaaaaaaaaa' })
                .set({ Authorization: employee.token })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('102052');

            done();
        });
        test('Error - Invalid date format', async done => {
            const res = await request(app)
                .put('/account/information')
                .send({ birthdayDate: 'aaaaaaaaaaaaa' })
                .set({ Authorization: employee.token })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('102053');

            done();
        });
        test('Error - This email is already used', async done => {
            const res = await request(app)
                .put('/account/information')
                .send({ email: customer.email })
                .set({ Authorization: employee.token })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('102054');

            done();
        });
        test('Error - Internal server error, avatar can not be saved', async done => {
            done();
        });
    });

    describe('PUT /account/password', () => {
        test('Success - Update user password', async done => {
            const res = await request(app)
                .put('/account/password')
                .send({ email: employee.email, oldPassword: 'Azerty1!', newPassword: 'Azerty1!' })
                .set({ Authorization: employee.token })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body.error).toBe(false);
            expect(res.body.message).toBe('Profile successfully updated');
            expect(res.body.user.type).not.toBe(undefined);
            expect(res.body.user.id).not.toBe(undefined);
            expect(res.body.user.name).not.toBe(undefined);
            expect(res.body.user.email).not.toBe(undefined);
            expect(res.body.user.token).not.toBe(undefined);
            expect(res.body.user.refreshToken).not.toBe(undefined);
            expect(res.body.user.createdAt).not.toBe(undefined);
            expect(res.body.user.updatedAt).not.toBe(undefined);

            done();
        });
        test('Error - Missing important fields', async done => {
            const res = await request(app)
                .put('/account/password')
                .send({ email: employee.email })
                .set({ Authorization: employee.token })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('102101');

            done();
        });
        test('Error - Invalid old password', async done => {
            const res = await request(app)
                .put('/account/password')
                .send({ email: employee.email, oldPassword: 'aaaaaaaaa', newPassword: 'Azerty1!' })
                .set({ Authorization: employee.token })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('102102');

            done();
        });
        test('Error - Invalid password format', async done => {
            const res = await request(app)
                .put('/account/password')
                .send({ email: employee.email, oldPassword: 'Azerty1!', newPassword: 'aaaaaaaaaa' })
                .set({ Authorization: employee.token })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('102103');

            done();
        });
    });

    describe('PUT /account/address', () => {
        test('Success - Update user address', async done => {
            const res = await request(app)
                .put('/account/address')
                .send({ zip: '75001' })
                .set({ Authorization: customer.token })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body.error).toBe(false);
            expect(res.body.message).toBe('Profile successfully updated');
            expect(res.body.user.type).not.toBe(undefined);
            expect(res.body.user.id).not.toBe(undefined);
            expect(res.body.user.name).not.toBe(undefined);
            expect(res.body.user.email).not.toBe(undefined);
            expect(res.body.user.token).not.toBe(undefined);
            expect(res.body.user.refreshToken).not.toBe(undefined);
            expect(res.body.user.createdAt).not.toBe(undefined);
            expect(res.body.user.updatedAt).not.toBe(undefined);

            done();
        });
        test('Error - You cannot edit your address with this account', async done => {
            const res = await request(app)
                .put('/account/address')
                .send({ zip: '75001' })
                .set({ Authorization: employee.token })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('102151');

            done();
        });
    });

    describe('PUT /account/enterprise', () => {
        test('Success - Update user enterprise', async done => {
            const res = await request(app)
                .put('/account/enterprise')
                .send({ activity: 'Téléphonie' })
                .set({ Authorization: customer.token })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(res.body.error).toBe(false);
            expect(res.body.message).toBe('Profile successfully updated');
            expect(res.body.user.type).not.toBe(undefined);
            expect(res.body.user.id).not.toBe(undefined);
            expect(res.body.user.name).not.toBe(undefined);
            expect(res.body.user.email).not.toBe(undefined);
            expect(res.body.user.token).not.toBe(undefined);
            expect(res.body.user.refreshToken).not.toBe(undefined);
            expect(res.body.user.createdAt).not.toBe(undefined);
            expect(res.body.user.updatedAt).not.toBe(undefined);

            done();
        });
        test('Error - You cannot edit your enterprise with this account', async done => {
            const res = await request(app)
                .put('/account/enterprise')
                .send({ activity: 'Téléphonie' })
                .set({ Authorization: employee.token })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
            expect(res.body.error).toBe(true);
            expect(res.body.code).toBe('102201');

            await User.deleteOne({ email: employee.email });
            await Client.deleteOne({ email: customer.email });
            done();
        });
    });
});
