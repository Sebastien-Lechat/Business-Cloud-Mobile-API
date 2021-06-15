import express from 'express';
import { ClientController } from '../controllers/ClientController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { historyMiddleware } from '../middlewares/historyMiddleware';


const route: express.Application = express();

route.post('/customer', [authMiddleware, historyMiddleware], ClientController.create);
route.put('/customer', [authMiddleware, historyMiddleware], ClientController.update);
route.delete('/customer/:id', [authMiddleware, historyMiddleware], ClientController.delete);

export { route as clientRouter };
