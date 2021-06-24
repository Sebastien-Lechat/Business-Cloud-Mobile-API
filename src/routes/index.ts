import express from 'express';
import { accountRouter } from './accountRoute';
import { articleRouter } from './articleRoute';
import { authRouter } from './authRoute';
import { billRouter } from './billRoute';
import { clientRouter } from './clientRoute';
import { conversationRouter } from './conversationRoute';
import { employeeRouter } from './employeeRoute';
import { estimateRouter } from './estimateRoute';
import { expenseRouter } from './expenseRoute';
import { globalRouter } from './globalRoute';
import { notificationRouter } from './notificationRoute';
import { projectRouter } from './projectRoute';
import { taskRouter } from './taskRoute';
import { timeRouter } from './timeRoute';
import { userExpenseRouter } from './userExpenseRoute';

const route: express.Application = express();

route.use(authRouter);
route.use(accountRouter);
route.use(globalRouter);
route.use(employeeRouter);
route.use(clientRouter);
route.use(billRouter);
route.use(estimateRouter);
route.use(articleRouter);
route.use(conversationRouter);
route.use(notificationRouter);
route.use(userExpenseRouter);
route.use(expenseRouter);
route.use(projectRouter);
route.use(taskRouter);
route.use(timeRouter);

export { route as RouteIndex };
