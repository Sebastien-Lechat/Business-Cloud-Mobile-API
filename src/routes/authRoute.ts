import express from 'express';
import { UserController } from '../controllers/UserController';

const route: express.Application = express();

route.post('/login', UserController.login);
route.post('/register', UserController.register);

export { route as authRouter };
