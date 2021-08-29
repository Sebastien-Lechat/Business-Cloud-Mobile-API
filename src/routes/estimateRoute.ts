import express from 'express';
import { EstimateController } from '../controllers/Estimatecontroller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { historyMiddleware } from '../middlewares/historyMiddleware';


const route: express.Application = express();

route.get('/estimates', [authMiddleware], EstimateController.getEstimatesList);
route.get('/estimate/:id', [authMiddleware], EstimateController.getOneEstimate);
route.post('/estimate', [authMiddleware, historyMiddleware], EstimateController.create);
route.put('/estimate', [authMiddleware, historyMiddleware], EstimateController.update);
route.delete('/estimate/:id', [authMiddleware, historyMiddleware], EstimateController.delete);
route.post('/estimate/:estimateId/customer/:clientId/mail', [authMiddleware, historyMiddleware], EstimateController.sendEstimateMail);
route.post('/estimate/transform/:estimateId', [authMiddleware, historyMiddleware], EstimateController.tranformEstimateToBill);

export { route as estimateRouter };

