import express from 'express';
import { AuthController } from '../controllers/AuthController';
import { ExternalAuthController } from '../controllers/ExternalAuthController';
import { authMiddleware } from '../middlewares/authMiddleware';

const route: express.Application = express();

route.post('/auth/login', AuthController.login);
route.post('/auth/external/login', ExternalAuthController.externalLogin);
route.post('/auth/register', AuthController.register);
route.post('/auth/request-password-lost', AuthController.requestPasswordLost);
route.post('/auth/request-verify-email', AuthController.requestVerifyEmail);
route.post('/auth/verify-email', AuthController.verifyEmail);
route.post('/auth/request-double-auth', AuthController.requestDoubleAuth);
route.post('/auth/activate-double-auth', [authMiddleware], AuthController.activateDoubleAuth);
route.delete('/auth/disconnect', [authMiddleware], AuthController.logout);

export { route as authRouter };
