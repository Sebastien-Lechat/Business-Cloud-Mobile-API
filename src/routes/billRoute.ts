import express from 'express';
import { BillController } from '../controllers/BillController';
import { authMiddleware } from '../middlewares/authMiddleware';


const route: express.Application = express();

route.get('/bills', [authMiddleware], BillController.getBillsList);
route.get('/bill/:id', [authMiddleware], BillController.getOneBill);
route.post('/bill', [authMiddleware], BillController.create);
route.put('/bill', [authMiddleware], BillController.update);
route.delete('/bill/:id', [authMiddleware], BillController.delete);

export { route as billRouter };
