import express from 'express';
import { UserExpenseController } from '../controllers/UserExpenseController';
import { authMiddleware } from '../middlewares/authMiddleware';


const route: express.Application = express();

route.get('/expenses-employee', [authMiddleware], UserExpenseController.getUserExpensesList);
route.post('/expense-employee', [authMiddleware], UserExpenseController.create);
route.delete('/expense-employee/:id', [authMiddleware], UserExpenseController.delete);

export { route as userExpenseRouter };
