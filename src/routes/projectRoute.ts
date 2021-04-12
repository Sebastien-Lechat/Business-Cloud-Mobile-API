import express from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { UserExpenseController } from '../controllers/UserExpenseController';
import { authMiddleware } from '../middlewares/authMiddleware';


const route: express.Application = express();

route.get('/projects', [authMiddleware], ProjectController.getProjectsList);
route.get('/project/:id', [authMiddleware], ProjectController.getOneProject);
route.post('/project', [authMiddleware], ProjectController.create);
route.put('/project', [authMiddleware], ProjectController.update);
route.delete('/project/:id', [authMiddleware], ProjectController.delete);

export { route as projectRouter };
