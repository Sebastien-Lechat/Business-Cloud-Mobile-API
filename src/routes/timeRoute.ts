import express from 'express';
import { TimeController } from '../controllers/TimeController';
import { authMiddleware } from '../middlewares/authMiddleware';


const route: express.Application = express();

route.get('/times/:projectId', [authMiddleware], TimeController.getTimesList);
route.post('/time', [authMiddleware], TimeController.create);
route.put('/time', [authMiddleware], TimeController.update);
route.delete('/time/:id', [authMiddleware], TimeController.delete);

export { route as timeRouter };

