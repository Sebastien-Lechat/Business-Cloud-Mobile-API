import express from 'express';
import { EmployeeController } from '../controllers/EmployeeController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { historyMiddleware } from '../middlewares/historyMiddleware';


const route: express.Application = express();

route.post('/employee', [authMiddleware, historyMiddleware], EmployeeController.create);
route.put('/employee', [authMiddleware, historyMiddleware], EmployeeController.update);
route.delete('/employee/:id', [authMiddleware, historyMiddleware], EmployeeController.delete);

export { route as employeeRouter };
