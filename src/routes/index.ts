import express from 'express';
import { authRouter } from './authRoute';
import { userRouter } from './userRouter';

const route: express.Application = express();

route.use(authRouter);
route.use(userRouter);

export { route as RouteIndex };
