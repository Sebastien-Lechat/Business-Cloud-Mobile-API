import express from 'express';
import { UserExpenseController } from '../controllers/UserExpenseController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { historyMiddleware } from '../middlewares/historyMiddleware';


const route: express.Application = express();

route.get('/expenses-employee', [authMiddleware], UserExpenseController.getUserExpensesList);
route.get('/expense-employee/:id', [authMiddleware], UserExpenseController.getOneUserExpense);
route.post('/expense-employee', [authMiddleware, historyMiddleware], UserExpenseController.create);
route.delete('/expense-employee/:id', [authMiddleware, historyMiddleware], UserExpenseController.delete);

export { route as userExpenseRouter };
