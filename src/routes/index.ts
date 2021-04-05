import express from 'express';
import { accountRouter } from './accountRoute';
import { authRouter } from './authRoute';
import { clientRouter } from './clientRoute';
import { employeeRouter } from './employeeRoute';

const route: express.Application = express();

route.use(authRouter);
route.use(accountRouter);
route.use(employeeRouter);
route.use(clientRouter);

export { route as RouteIndex };
