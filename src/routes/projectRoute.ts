import express from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { UserExpenseController } from '../controllers/UserExpenseController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { historyMiddleware } from '../middlewares/historyMiddleware';


const route: express.Application = express();

route.get('/projects', [authMiddleware], ProjectController.getProjectsList);
route.get('/project/:id', [authMiddleware], ProjectController.getOneProject);
route.post('/project', [authMiddleware, historyMiddleware], ProjectController.create);
route.put('/project', [authMiddleware, historyMiddleware], ProjectController.update);
route.delete('/project/:id', [authMiddleware, historyMiddleware], ProjectController.delete);

export { route as projectRouter };
