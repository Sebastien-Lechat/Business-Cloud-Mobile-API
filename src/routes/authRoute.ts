import express from 'express';
import { AuthController } from '../controllers/AuthController';

const route: express.Application = express();

route.post('/auth/login', AuthController.login);
route.post('/auth/register', AuthController.register);
route.post('/auth/request-password-lost', AuthController.requestPasswordLost);
route.post('/auth/request-verify-email', AuthController.requestVerifyEmail);
route.post('/auth/verify-email', AuthController.verifyEmail);
route.post('/auth/request-double-auth', AuthController.requestDoubleAuth);

export { route as authRouter };
