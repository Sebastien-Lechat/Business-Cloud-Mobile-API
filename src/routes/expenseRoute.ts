import express from 'express';
import { ExpenseController } from '../controllers/ExpenseController';
import { authMiddleware } from '../middlewares/authMiddleware';


const route: express.Application = express();

route.get('/expenses/:projectId', [authMiddleware], ExpenseController.getExpensesList);
route.get('/expense/:id', [authMiddleware], ExpenseController.getOneExpense);
route.post('/expense', [authMiddleware], ExpenseController.create);
route.delete('/expense/:id', [authMiddleware], ExpenseController.delete);

export { route as expenseRouter };

