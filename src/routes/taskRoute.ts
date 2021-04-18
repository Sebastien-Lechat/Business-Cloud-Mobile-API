import express from 'express';
import { TaskController } from '../controllers/TaskController';
import { UserExpenseController } from '../controllers/UserExpenseController';
import { authMiddleware } from '../middlewares/authMiddleware';


const route: express.Application = express();

route.get('/tasks/:projectId', [authMiddleware], TaskController.getTasksList);
route.post('/task', [authMiddleware], TaskController.create);
route.delete('/task/:id', [authMiddleware], TaskController.delete);

export { route as taskRouter };
