import express from 'express';
import { GlobalController } from '../controllers/GlobalController';
import { authMiddleware } from '../middlewares/authMiddleware';

const route: express.Application = express();

route.get('/global/generateInvoice/:type/:id', [authMiddleware], GlobalController.generateInvoice);
route.get('/global/nextNumber', [authMiddleware], GlobalController.getNextNumber);
route.get('/global/statistics', [authMiddleware], GlobalController.getStatistic);

export { route as globalRouter };
