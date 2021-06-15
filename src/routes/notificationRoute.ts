import express from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { historyMiddleware } from '../middlewares/historyMiddleware';

const route: express.Application = express();

route.get('/notifications', [authMiddleware], NotificationController.getNotificationsList);
route.get('/notifications/count', [authMiddleware], NotificationController.getNotificationsCount);
route.delete('/notification/:id', [authMiddleware], NotificationController.delete);

export { route as notificationRouter };
