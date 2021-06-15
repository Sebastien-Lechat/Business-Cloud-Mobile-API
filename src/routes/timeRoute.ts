import express from 'express';
import { TimeController } from '../controllers/TimeController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { historyMiddleware } from '../middlewares/historyMiddleware';


const route: express.Application = express();

route.get('/times/:projectId', [authMiddleware], TimeController.getTimesList);
route.post('/time', [authMiddleware, historyMiddleware], TimeController.create);
route.put('/time', [authMiddleware, historyMiddleware], TimeController.update);
route.delete('/time/:id', [authMiddleware, historyMiddleware], TimeController.delete);

export { route as timeRouter };

