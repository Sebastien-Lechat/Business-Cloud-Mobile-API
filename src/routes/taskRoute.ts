import express from 'express';
import { TaskController } from '../controllers/TaskController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { historyMiddleware } from '../middlewares/historyMiddleware';


const route: express.Application = express();

route.get('/tasks/:projectId', [authMiddleware], TaskController.getTasksList);
route.post('/task', [authMiddleware, historyMiddleware], TaskController.create);
route.delete('/task/:id', [authMiddleware, historyMiddleware], TaskController.delete);

export { route as taskRouter };
