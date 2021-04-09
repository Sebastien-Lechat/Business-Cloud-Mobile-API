import express from 'express';
import { BillController } from '../controllers/BillController';
import { EstimateController } from '../controllers/Estimatecontroller';
import { authMiddleware } from '../middlewares/authMiddleware';


const route: express.Application = express();

route.get('/estimates', [authMiddleware], EstimateController.getEstimatesList);
route.get('/estimate/:id', [authMiddleware], EstimateController.getOneEstimate);
route.post('/estimate', [authMiddleware], EstimateController.create);
route.put('/estimate', [authMiddleware], EstimateController.update);
route.delete('/estimate/:id', [authMiddleware], EstimateController.delete);

export { route as estimateRouter };
