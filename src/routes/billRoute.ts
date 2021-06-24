import express from 'express';
import { BillController } from '../controllers/BillController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { historyMiddleware } from '../middlewares/historyMiddleware';


const route: express.Application = express();

route.get('/bills', [authMiddleware], BillController.getBillsList);
route.get('/bill/:id', [authMiddleware], BillController.getOneBill);
route.post('/bill', [authMiddleware, historyMiddleware], BillController.create);
route.put('/bill', [authMiddleware, historyMiddleware], BillController.update);
route.delete('/bill/:id', [authMiddleware, historyMiddleware], BillController.delete);
route.post('/bill/:billId/customer/:clientId/mail', [authMiddleware, historyMiddleware], BillController.sendBillMail);

export { route as billRouter };
