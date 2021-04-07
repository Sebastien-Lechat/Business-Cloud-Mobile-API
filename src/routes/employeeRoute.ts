import express from 'express';
import { EmployeeController } from '../controllers/EmployeeController';
import { authMiddleware } from '../middlewares/authMiddleware';


const route: express.Application = express();

route.post('/employee', [authMiddleware], EmployeeController.create);
route.put('/employee', [authMiddleware], EmployeeController.update);
route.delete('/employee/:id', [authMiddleware], EmployeeController.delete);

export { route as employeeRouter };
