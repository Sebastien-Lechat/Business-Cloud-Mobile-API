import express from 'express';
import { userRouter } from './userRouter';

const route: express.Application = express();

route.use(userRouter);

export { route as RouteIndex };
