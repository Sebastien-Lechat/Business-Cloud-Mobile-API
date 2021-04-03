import express from 'express';
import { ClientController } from '../controllers/ClientController';
import { authMiddleware } from '../middlewares/authMiddleware';


const route: express.Application = express();

route.post('/customer', [authMiddleware], ClientController.create);
route.put('/customer', [authMiddleware], ClientController.update);
route.delete('/customer/:id', [authMiddleware], ClientController.delete);

export { route as clientRouter };
