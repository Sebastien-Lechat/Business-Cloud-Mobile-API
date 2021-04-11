import express from 'express';
import { accountRouter } from './accountRoute';
import { articleRouter } from './articleRoute';
import { authRouter } from './authRoute';
import { billRouter } from './billRoute';
import { clientRouter } from './clientRoute';
import { employeeRouter } from './employeeRoute';
import { estimateRouter } from './estimateRoute';

const route: express.Application = express();

route.use(authRouter);
route.use(accountRouter);
route.use(employeeRouter);
route.use(clientRouter);
route.use(billRouter);
route.use(estimateRouter);
route.use(articleRouter);

export { route as RouteIndex };
