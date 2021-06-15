import express from 'express';
import { AccountController } from '../controllers/AccountController';
import { authMiddleware } from '../middlewares/authMiddleware';

const route: express.Application = express();

route.get('/users', [authMiddleware], AccountController.getUsersList);
route.get('/user/:id', [authMiddleware], AccountController.getUser);
route.get('/user/history/:id', [authMiddleware], AccountController.getHistory);
route.get('/account', [authMiddleware], AccountController.getProfile);
route.put('/account/register-fcm', [authMiddleware], AccountController.fcmRegisterDevice);
route.put('/account/information', [authMiddleware], AccountController.modifyPersonnalInfo);
route.put('/account/password', [authMiddleware], AccountController.modifyPassword);
route.put('/account/address', [authMiddleware], AccountController.modifyAddress);
route.put('/account/enterprise', [authMiddleware], AccountController.modifyEnterprise);


export { route as accountRouter };
