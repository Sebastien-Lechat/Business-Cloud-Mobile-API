import express from 'express';
import { UserController } from '../controllers/UserController';

const route: express.Application = express();

route.post('/login', UserController.login);

export { route as userRouter };
