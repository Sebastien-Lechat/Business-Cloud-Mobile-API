import express from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { authMiddleware } from '../middlewares/authMiddleware';

const route: express.Application = express();

route.get('/notifications', [authMiddleware], NotificationController.getNotificationsList);
route.delete('/notification/:id', [authMiddleware], NotificationController.delete);

export { route as notificationRouter };
