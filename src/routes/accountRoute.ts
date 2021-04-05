import express from 'express';
import { AccountController } from '../controllers/AccountController';
import { authMiddleware } from '../middlewares/authMiddleware';

const route: express.Application = express();

route.get('/account', [authMiddleware], AccountController.getProfile);
route.put('/account/information', [authMiddleware], AccountController.modifyPersonnalInfo);
route.put('/account/password', [authMiddleware], AccountController.modifyPassword);
route.put('/account/address', [authMiddleware], AccountController.modifyAddress);
route.put('/account/enterprise', [authMiddleware], AccountController.modifyEnterprise);


export { route as accountRouter };
